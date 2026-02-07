import { Router } from 'express';
import { login, register } from './auth.controller';
import { requestPasswordReset, resetPassword } from './recovery.controller';
import { authLimiter, registerLimiter } from '../../middlewares/rateLimit';

const router = Router();

router.post('/login', authLimiter, login);
router.post('/register', registerLimiter, register);
router.post('/recovery/request', authLimiter, requestPasswordReset);
router.post('/recovery/reset', authLimiter, resetPassword);

export default router;
