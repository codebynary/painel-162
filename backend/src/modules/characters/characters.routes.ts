import { Router } from 'express';
import { getUserCharacters, teleportChar, resetBank, getItems } from './characters.controller';
import { authenticateToken } from '../auth/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getUserCharacters);
router.post('/:roleId/teleport', authenticateToken, teleportChar);
router.post('/:roleId/reset-bank', authenticateToken, resetBank);
router.get('/:roleId/items', authenticateToken, getItems);

export default router;
