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
            [Number(userId)]
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

    /**
     * Fetch character inventory items with real names.
     */
    static async getInventory(roleId: number): Promise<any[]> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT i.slot, i.item_id, i.count, 
                    COALESCE(d.name, i.name) as name, 
                    COALESCE(d.name_color, 'FFFFFF') as name_color,
                    i.icon 
             FROM pw_users.character_inventory i
             LEFT JOIN pw_users.pw_items_data d ON i.item_id = d.item_id
             WHERE i.roleid = ? ORDER BY i.slot ASC`,
            [roleId]
        );
        return rows;
    }

    /**
     * Fetch character bank items with real names.
     */
    static async getBank(roleId: number): Promise<any[]> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT b.slot, b.item_id, b.count, 
                    COALESCE(d.name, b.name) as name, 
                    COALESCE(d.name_color, 'FFFFFF') as name_color,
                    b.icon 
             FROM pw_users.character_bank b
             LEFT JOIN pw_users.pw_items_data d ON b.item_id = d.item_id
             WHERE b.roleid = ? ORDER BY b.slot ASC`,
            [roleId]
        );
        return rows;
    }
}
