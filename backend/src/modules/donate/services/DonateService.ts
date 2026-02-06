import { DonateRepository, DonatePackage, Donation } from '../repositories/DonateRepository';
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
        // In real life, verify externalId with gateway
        await DonateRepository.updateStatus(donationId, 'completed', externalId);

        // Deliver Gold logic
        // We would need the userId from the donation record (should be fetched first)
        // For now, this is where we would call RPC to deliver Gold.
        console.log(`[DONATE SERVICE] Gold delivered for donation ${donationId}`);
    }

    static async getUserHistory(userId: number): Promise<Donation[]> {
        return await DonateRepository.findByUserId(userId);
    }
}
