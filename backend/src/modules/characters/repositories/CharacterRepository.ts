import pool from '../../../config/database';
import { RowDataPacket } from 'mysql2';

export interface Character {
    id: number;
    roleid: number;
    name: string;
    cls: number;
    level: number;
    gender: number;
    reputation: number;
}

export class CharacterRepository {
    /**
     * Fetch all characters for a specific user.
     */
    static async findByUserId(userId: number): Promise<Character[]> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT id, roleid, name, cls, level, gender, reputation 
       FROM characters 
       WHERE userid = ? AND status = 1`,
            [userId]
        );

        return rows as Character[];
    }

    /**
     * Find a specific character by its Role ID.
     */
    static async findByRoleId(roleId: number): Promise<Character | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT id, roleid, name, cls, level, gender, reputation 
       FROM characters 
       WHERE roleid = ?`,
            [roleId]
        );

        if (rows.length === 0) return null;
        return rows[0] as Character;
    }
}
