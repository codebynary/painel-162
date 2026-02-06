import { Router } from 'express';
import { getServerStatus } from '../admin/admin.controller';

const router = Router();

// Public route to check overall server health/status
router.get('/status', getServerStatus);

export default router;
