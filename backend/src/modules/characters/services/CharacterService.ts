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
        const inventory = await CharacterRepository.getInventory(roleId);
        const bank = await CharacterRepository.getBank(roleId);

        return {
            inventory,
            bank
        };
    }
}
