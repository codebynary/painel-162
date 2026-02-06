import { Request, Response } from 'express';
import { DonateService } from './services/DonateService';

export const getPackages = async (req: Request, res: Response) => {
    try {
        const packages = await DonateService.getPackages();
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching packages' });
    }
};

export const createPayment = async (req: Request, res: Response) => {
    const { packageId } = req.body;
    const userId = (req as any).user?.id;

    if (!packageId) {
        return res.status(400).json({ message: 'Package ID is required' });
    }

    try {
        const result = await DonateService.createPayment(Number(userId), Number(packageId));
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getHistory = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    try {
        const history = await DonateService.getUserHistory(Number(userId));
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching history' });
    }
};

export const webhook = async (req: Request, res: Response) => {
    // ... (webhook code)
};

export const getBalance = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    try {
        const balance = await DonateService.getBalance(Number(userId));
        res.json({ balance });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching balance' });
    }
};
