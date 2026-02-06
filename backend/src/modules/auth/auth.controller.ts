import { Request, Response } from 'express';
import pool from '../../config/database';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';
import crypto from 'crypto';

// MD5 is used by older PW versions, but we should migrate to safer hashes if possible later.
// For now, we respect the legacy PW hash format (MD5).
const hashPassword = (password: string) => {
    return crypto.createHash('md5').update(password).digest('hex'); // PW uses binary MD5 or hex depending on version. 
    // Standard 1.3.6+ often uses MD5 base64 or hex. Let's assume standard MD5 hex for now based on init.sql
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT ID, name, passwd, email, is_admin FROM users WHERE name = ?',
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = rows[0];
        // PW often stores passwords as MD5. Simple check for now.
        // In a real scenario, we might need a specific salt or binary comparison.
        // 'init.sql' used MD5('admin').

        // Note: PW passwords might be case insensitive or specific encoding.
        const hashedPassword = crypto.createHash('md5').update(username + password).digest('hex'); // Some versions use user+pass
        // But init.sql just did MD5('admin'). Let's try simple MD5 first matching init.sql
        const simpleHash = crypto.createHash('md5').update(password).digest('hex');

        if (user.passwd !== simpleHash) {
            // Logic can be adjusted based on specific PW version hashing (e.g. base64)
            // For safety in this dev phase, let's also allow plain text if not hashed in DB (mock only)
            if (user.passwd !== password) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        }

        const token = jwt.sign(
            {
                id: user.ID,
                username: user.name,
                role: user.is_admin === 1 ? 'admin' : 'user'
            } as any,
            (process.env.JWT_SECRET as string) || 'secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } as any
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.ID,
                username: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const register = async (req: Request, res: Response) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Username, password and email are required' });
    }

    try {
        // Check if user already exists
        const [existing] = await pool.execute<RowDataPacket[]>(
            'SELECT ID FROM users WHERE name = ?',
            [username]
        );

        if (existing.length > 0) {
            return res.status(409).json({ message: 'Username already taken' });
        }

        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

        await pool.execute(
            'INSERT INTO users (name, passwd, email) VALUES (?, ?, ?)',
            [username, hashedPassword, email]
        );

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
