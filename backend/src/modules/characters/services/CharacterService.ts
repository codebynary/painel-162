import { CharacterRepository, Character } from '../repositories/CharacterRepository';
import { GDeliveryClient } from '../../rpc/GDeliveryClient';
import pool from '../../../config/database';

export class CharacterService {
    /**
     * Logic to get all characters of a user.
     */
    static async getUserCharacters(userId: number): Promise<Character[]> {
        return await CharacterRepository.findByUserId(userId);
    }

    /**
     * Logic to reset character coordinates (Teleport/Unstuck).
     */
    static async teleportToStart(roleId: number): Promise<void> {
        const character = await CharacterRepository.findByRoleId(roleId);
        if (!character) throw new Error('Personagem não encontrado');

        // Safe Coordinates: Cidade das Espadas (Default)
        // world_id: 1, X: 440, Y: 220, Z: 880 (Approximation)
        await CharacterRepository.updatePosition(roleId, 1, 440, 220, 880);
    }

    /**
     * Logic to reset character bank password.
     */
    static async resetBankPassword(roleId: number): Promise<void> {
        const character = await CharacterRepository.findByRoleId(roleId);
        if (!character) throw new Error('Personagem não encontrado');

        await CharacterRepository.resetBankPassword(roleId);
    }

    /**
     * Get inventory and bank items for a character.
     */
    static async getCharacterItems(roleId: number) {
        let inventory = await CharacterRepository.getInventory(roleId);
        let bank = await CharacterRepository.getBank(roleId);

        // Simple mock IDs if empty for demo, but names come from DB now
        if (inventory.length === 0) {
            inventory = [
                { slot: 0, item_id: 11208, count: 50 },
                { slot: 1, item_id: 12979, count: 1 },
                { slot: 2, item_id: 20234, count: 1 },
                { slot: 3, item_id: 10, count: 500 },
                { slot: 4, item_id: 8, count: 1 }
            ];
            // Enrich mocks with names from DB if possible
            for (let item of inventory) {
                const [data] = await pool.execute<any[]>('SELECT name, name_color FROM pw_items_data WHERE item_id = ?', [item.item_id]);
                if (data && data[0]) {
                    item.name = data[0].name;
                    item.name_color = data[0].name_color;
                }
            }
        }

        return { inventory, bank };
    }
}
