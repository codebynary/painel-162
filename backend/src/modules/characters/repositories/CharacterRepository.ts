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
       FROM pw_users.characters 
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
       FROM pw_users.characters 
       WHERE roleid = ?`,
            [roleId]
        );

        if (rows.length === 0) return null;
        return rows[0] as Character;
    }
    /**
     * Update character position (Unstuck).
     */
    static async updatePosition(roleId: number, mapId: number, x: number, y: number, z: number): Promise<void> {
        // In the mock environment, we update the characters table.
        // In a real environment, this would likely be an RPC call or gamedbd update.
        await pool.execute(
            'UPDATE pw_users.characters SET world_id = ?, pos_x = ?, pos_y = ?, pos_z = ? WHERE roleid = ?',
            [mapId, x, y, z, roleId]
        );
    }

    /**
     * Reset character bank password.
     */
    static async resetBankPassword(roleId: number): Promise<void> {
        // Mocking bank password reset.
        await pool.execute(
            'UPDATE pw_users.characters SET bank_password = NULL WHERE roleid = ?',
            [roleId]
        );
    }
}
