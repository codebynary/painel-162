import { DonateRepository, DonatePackage, Donation } from '../repositories/DonateRepository';
import pool from '../../../config/database';
import { GDeliveryClient } from '../../rpc/GDeliveryClient';

export class DonateService {
    /**
     * Get all active packages.
     */
    static async getPackages(): Promise<DonatePackage[]> {
        return await DonateRepository.findAllPackages();
    }

    /**
     * Initiate a donation process.
     */
    static async createPayment(userId: number, packageId: number): Promise<{ donationId: number; paymentUrl: string }> {
        const pkg = await DonateRepository.findPackageById(packageId);
        if (!pkg) throw new Error('Pacote não encontrado');

        const donationId = await DonateRepository.createDonation(userId, pkg);

        // Mocking a payment gateway URL (e.g., MercadoPago)
        const paymentUrl = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=mock_${donationId}`;

        return { donationId, paymentUrl };
    }

    /**
     * Webhook/Callback to confirm payment and deliver Gold.
     */
    static async confirmPayment(donationId: number, externalId: string): Promise<void> {
        // 1. Update donation status in history
        await DonateRepository.updateStatus(donationId, 'completed', externalId);

        // 2. Fetch the donation to get userId and goldAmount
        const [rows]: any = await pool.execute(
            'SELECT userid, gold_amount FROM donations WHERE id = ?',
            [donationId]
        );

        if (rows.length > 0) {
            const { userid, gold_amount } = rows[0];
            // 3. Update the real balance in units_cash
            await DonateRepository.addBalance(userid, gold_amount);
            console.log(`[DONATE SERVICE] Delivered ${gold_amount} cash to user ${userid}`);
        }
    }

    static async getUserHistory(userId: number): Promise<Donation[]> {
        return await DonateRepository.findByUserId(userId);
    }

    static async getBalance(userId: number): Promise<number> {
        const balance = await DonateRepository.getBalance(userId);

        // Initial gift for new users/admins in demo
        if (userId === 1 && balance === 0) {
            await DonateRepository.addBalance(1, 10000);
            return 10000;
        }

        return balance;
    }
}
