import { Router } from 'express';
import { getPackages, createPayment, webhook, getHistory, getBalance } from './donate.controller';
import { authenticateToken } from '../auth/auth.middleware';

const router = Router();

router.get('/packages', authenticateToken, getPackages);
router.get('/balance', authenticateToken, getBalance);
router.post('/create', authenticateToken, createPayment);
router.get('/history', authenticateToken, getHistory);
router.post('/webhook', webhook);

export default router;
