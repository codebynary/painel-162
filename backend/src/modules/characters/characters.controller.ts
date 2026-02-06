import { Request, Response } from 'express';
import { CharacterService } from './services/CharacterService';

export const getUserCharacters = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const characters = await CharacterService.getUserCharacters(userId);
        res.json(characters);
    } catch (error) {
        console.error('Error fetching characters:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const teleportChar = async (req: Request, res: Response) => {
    const { roleId } = req.params;

    try {
        await CharacterService.teleportToStart(Number(roleId));
        res.json({ message: 'Personagem teleportado para a Cidade Principal' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const resetBank = async (req: Request, res: Response) => {
    const { roleId } = req.params;

    try {
        await CharacterService.resetBankPassword(Number(roleId));
        res.json({ message: 'Senha do banco resetada com sucesso' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getItems = async (req: Request, res: Response) => {
    const { roleId } = req.params;

    try {
        const data = await CharacterService.getCharacterItems(Number(roleId));
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao buscar itens do personagem' });
    }
};
