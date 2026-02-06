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

    /**
     * Get user cash balance.
     */
    static async getBalance(userId: number): Promise<number> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT cash FROM units_cash WHERE userid = ?',
            [userId]
        );
        if (rows.length === 0) return 0;
        return rows[0].cash;
    }

    /**
     * Add cash to user balance.
     */
    static async addBalance(userId: number, amount: number): Promise<void> {
        await pool.execute(
            'INSERT INTO units_cash (userid, cash) VALUES (?, ?) ON DUPLICATE KEY UPDATE cash = cash + ?',
            [userId, amount, amount]
        );
    }

    /**
     * Create a new donate package.
     */
    static async createPackage(pkg: Omit<DonatePackage, 'id'>): Promise<number> {
        const [result] = await pool.execute<ResultSetHeader>(
            'INSERT INTO donate_packages (name, price, gold, bonus, image_url) VALUES (?, ?, ?, ?, ?)',
            [pkg.name, pkg.price, pkg.gold, pkg.bonus, pkg.image_url || null]
        );
        return result.insertId;
    }

    /**
     * Update an existing donate package.
     */
    static async updatePackage(id: number, pkg: Partial<DonatePackage>): Promise<void> {
        const fields: string[] = [];
        const values: any[] = [];

        if (pkg.name) { fields.push('name = ?'); values.push(pkg.name); }
        if (pkg.price !== undefined) { fields.push('price = ?'); values.push(pkg.price); }
        if (pkg.gold !== undefined) { fields.push('gold = ?'); values.push(pkg.gold); }
        if (pkg.bonus !== undefined) { fields.push('bonus = ?'); values.push(pkg.bonus); }
        if (pkg.image_url !== undefined) { fields.push('image_url = ?'); values.push(pkg.image_url); }

        if (fields.length === 0) return;

        values.push(id);
        await pool.execute(
            `UPDATE donate_packages SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
    }

    /**
     * Delete a donate package.
     */
    static async deletePackage(id: number): Promise<void> {
        await pool.execute('DELETE FROM donate_packages WHERE id = ?', [id]);
    }
}
