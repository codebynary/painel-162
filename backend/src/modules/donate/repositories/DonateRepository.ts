import pool from '../../../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface DonatePackage {
    id: number;
    name: string;
    price: number;
    gold: number;
    bonus: number;
    image_url?: string;
}

export interface Donation {
    id: number;
    userId: number;
    packageId: number;
    amount: number;
    goldAmount: number;
    status: 'pending' | 'completed' | 'cancelled';
    paymentId?: string;
    createdAt: Date;
}

export class DonateRepository {
    /**
     * Fetch all available donation packages.
     */
    static async findAllPackages(): Promise<DonatePackage[]> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT id, name, price, gold, bonus, image_url FROM donate_packages ORDER BY price ASC'
        );
        return rows as DonatePackage[];
    }

    /**
     * Find a specific package by ID.
     */
    static async findPackageById(id: number): Promise<DonatePackage | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM donate_packages WHERE id = ?',
            [id]
        );
        if (rows.length === 0) return null;
        return rows[0] as DonatePackage;
    }

    /**
     * Create a new donation record.
     */
    static async createDonation(userId: number, pkg: DonatePackage): Promise<number> {
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO donations (userid, package_id, amount, gold_amount, status) 
       VALUES (?, ?, ?, ?, 'pending')`,
            [userId, pkg.id, pkg.price, pkg.gold + pkg.bonus]
        );
        return result.insertId;
    }

    /**
     * Update donation status.
     */
    static async updateStatus(id: number, status: string, paymentId?: string): Promise<void> {
        await pool.execute(
            'UPDATE donations SET status = ?, payment_id = ? WHERE id = ?',
            [status, paymentId || null, id]
        );
    }

    /**
     * Fetch user donation history.
     */
    static async findByUserId(userId: number): Promise<Donation[]> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM donations WHERE userid = ? ORDER BY created_at DESC',
            [userId]
        );
        return rows as Donation[];
    }
}
