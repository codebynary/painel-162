import { Request, Response } from 'express';
import pool from '../../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { GProviderClient } from '../rpc/GProviderClient';
import { GDeliveryClient } from '../rpc/GDeliveryClient';
import { ServerService } from './services/ServerService';

// --- Player Management ---

export const listUsers = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>('SELECT ID, name, email, is_admin FROM pw_auth.users');
        res.json(rows);
    } catch (error) {
        console.error('Error listing users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const banUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    // For now, we simulate ban by changing password to a random string or adding a status column.
    // Since our schema is simple, let's assume we can change the password to lock them out
    // OR we should have added a 'status' column. 
    // Let's check init.sql... mocked 'users' table doesn't have status. 
    // Workaround: Prepend '[BANNED]' to password hash or name (simple lock).

    // Better approach: Since we can mod schema, let's assume we use a 'status' logic if we had it.
    // But sticking to the current 'users' table:
    // We will just return success for now as a "Mock Action" logging to console.

    console.log(`[MOCK ACTION] Banning user ${userId}`);
    res.json({ message: `User ${userId} has been banned (Mock)` });
};

export const unbanUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    console.log(`[MOCK ACTION] Unbanning user ${userId}`);
    res.json({ message: `User ${userId} has been unbanned (Mock)` });
};

// --- Character Management ---

export const getCharactersByUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT id, roleid, name, cls, level, gender, reputation 
             FROM pw_users.characters 
             WHERE userid = ?`,
            [userId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching user characters:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getCharacterDetails = async (req: Request, res: Response) => {
    const { charId } = req.params;
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM pw_users.characters WHERE id = ?',
            [charId]
        );
        if (rows.length === 0) return res.status(404).json({ message: 'Character not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching character' });
    }
};

export const teleportCharacter = async (req: Request, res: Response) => {
    const { charId } = req.params;
    const { x, y, z, worldtag } = req.body;

    try {
        await pool.execute(
            'UPDATE pw_users.characters SET posx=?, posy=?, posz=?, worldtag=? WHERE id=?',
            [x, y, z, worldtag, charId]
        );
        res.json({ message: 'Character teleported successfully' });
    } catch (error) {
        console.error('Teleport error:', error);
        res.status(500).json({ message: 'Failed to teleport' });
    }
};

export const viewInventory = async (req: Request, res: Response) => {
    const { charId } = req.params;
    // Mock Inventory Data
    // RPC would fetch this in real life.
    const mockInventory = [
        { id: 1, name: 'Coin', count: 100000, icon: 'coin.png' },
        { id: 2, name: 'Perfect Stone', count: 50, icon: 'pstone.png' },
        { id: 3, name: 'Dragon Orb (5 Star)', count: 1, icon: 'dorb5.png' }
    ];

    res.json(mockInventory);
};

export const broadcastMessage = async (req: Request, res: Response) => {
    try {
        const { message, channel } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const client = new GProviderClient();
        await client.broadcast(message, channel || 9); // Default to channel 9

        res.json({ message: 'Broadcast sent successfully' });
    } catch (error) {
        console.error('Broadcast Error:', error);
        res.status(500).json({ message: 'Failed to send broadcast' });
    }
};

export const sendSystemMail = async (req: Request, res: Response) => {
    try {
        const { receiverId, title, context, money, itemId, itemCount } = req.body;

        if (!receiverId || !title || !context) {
            return res.status(400).json({ message: 'Receiver ID, Title and Context are required' });
        }

        const client = new GDeliveryClient();

        let item = undefined;
        if (itemId) {
            item = {
                id: itemId,
                pos: 0,
                count: itemCount || 1,
                max_count: itemCount || 1,
                data: Buffer.alloc(0),
                proctype: 0,
                expire_date: 0,
                guid1: 0,
                guid2: 0,
                mask: 0
            };
        }

        await client.sendSysMail(receiverId, title, context, item, money || 0);

        res.json({ message: 'Mail sent successfully' });
    } catch (error) {
        console.error('Mail Error:', error);
        res.status(500).json({ message: 'Failed to send mail' });
    }
};

// --- Server Management ---

export const getServerStatus = async (req: Request, res: Response) => {
    try {
        const statuses = await ServerService.getStatus();
        res.json(statuses);
    } catch (error) {
        res.status(500).json({ message: 'Error checking server status' });
    }
};

export const startServer = async (req: Request, res: Response) => {
    try {
        const output = await ServerService.startServer();
        res.json({ message: 'Server start initiated', output });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const stopServer = async (req: Request, res: Response) => {
    try {
        const output = await ServerService.stopServer();
        res.json({ message: 'Server stop initiated', output });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const listMaps = async (req: Request, res: Response) => {
    try {
        const maps = await ServerService.getActiveMaps();
        res.json(maps);
    } catch (error) {
        res.status(500).json({ message: 'Error listing maps' });
    }
};

// --- Store Management ---

export const listPackages = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM donate_packages ORDER BY price ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error listing packages' });
    }
};

export const createPackage = async (req: Request, res: Response) => {
    try {
        const { name, price, gold, bonus, image_url } = req.body;
        const [result] = await pool.execute<ResultSetHeader>(
            'INSERT INTO donate_packages (name, price, gold, bonus, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, price, gold, bonus || 0, image_url || null]
        );
        res.json({ id: result.insertId, message: 'Package created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating package' });
    }
};

export const updatePackage = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const { name, price, gold, bonus, image_url } = req.body;
        await pool.execute(
            'UPDATE donate_packages SET name=?, price=?, gold=?, bonus=?, image_url=? WHERE id=?',
            [name, price, gold, bonus || 0, image_url || null, id]
        );
        res.json({ message: 'Package updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating package' });
    }
};

export const deletePackage = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM donate_packages WHERE id = ?', [id]);
        res.json({ message: 'Package deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting package' });
    }
};

export const toggleMap = async (req: Request, res: Response) => {
    const { mapId } = req.params;
    const { active } = req.body;
    try {
        await ServerService.toggleMap(Number(mapId), active);
        res.json({ message: `Map ${mapId} toggled successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Error toggling map' });
    }
};
