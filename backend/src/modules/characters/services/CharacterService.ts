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
     * Logic to reset character coordinates (Teleport).
     * This bridges with the RPC layer if necessary or direct SQL if gamedbd allows.
     */
    static async teleportToStart(roleId: number): Promise<boolean> {
        const character = await CharacterRepository.findByRoleId(roleId);
        if (!character) throw new Error('Character not found');

        // In a future expansion, we might call GDeliveryClient.teleport(roleId, 128, 200, 128)
        // For now, let's assume we update the DB direct (if server is offline or uses direct DB sync)
        // Actually, premium approach should use RPC if available. 
        // GDeliveryClient logic is in src/modules/rpc.

        return true; // Mock success for now
    }
}
