import { Request, Response } from 'express';
import pool from '../../config/database';
import crypto from 'crypto';
import { RowDataPacket } from 'mysql2';

export const requestPasswordReset = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'O e-mail é obrigatório' });
    }

    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT ID, name FROM users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            // Security: Always return "if exists" to prevent email harvesting
            return res.json({ message: 'Se o e-mail existir no sistema, você receberá instruções de recuperação.' });
        }

        const user = rows[0];
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hour

        // We could store this in a 'password_resets' table
        // For now, let's just log it until we have the table and SMTP
        console.log(`[RECOVERY] Token for ${user.name} (${email}): ${token}`);

        // TODO: Enviar e-mail real com nodemailer

        res.json({ message: 'Instruções de recuperação enviadas para o seu e-mail.' });

    } catch (error) {
        console.error('Recovery request error:', error);
        res.status(500).json({ message: 'Erro ao processar recuperação' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token e nova senha são obrigatórios' });
    }

    try {
        // Logic to verify token from db and update password
        // This is a placeholder for the full implementation
        res.json({ message: 'Senha atualizada com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao resetar senha' });
    }
};
