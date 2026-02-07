import { CharacterRepository, Character } from '../repositories/CharacterRepository';
import { GDeliveryClient } from '../../rpc/GDeliveryClient';

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

        // Mock Data for Development/Empty DB
        if (inventory.length === 0) {
            inventory = [
                { slot: 0, item_id: 11208, count: 50, name: 'Pedra de Hiper XP' },
                { slot: 1, item_id: 12979, count: 1, name: 'Montaria: Pantera' },
                { slot: 2, item_id: 20234, count: 1, name: 'Equipamento Rank 8' },
                { slot: 3, item_id: 10, count: 500, name: 'Alto-Falante Global' },
                { slot: 4, item_id: 8, count: 1, name: 'Pergaminho de Treino' }
            ];
        }

        if (bank.length === 0) {
            bank = [
                { slot: 0, item_id: 4000, count: 10, name: 'Barra de Ouro' },
                { slot: 1, item_id: 5000, count: 5, name: 'Kit de Refino +10' }
            ];
        }

        return {
            inventory,
            bank
        };
    }
}
