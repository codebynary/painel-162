import { Router } from 'express';
import { getUserCharacters, teleportChar } from './characters.controller';
import { authenticateToken } from '../auth/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getUserCharacters);
router.post('/:roleId/teleport', authenticateToken, teleportChar);

export default router;
