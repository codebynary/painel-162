import { Router } from 'express';
import { isAdmin } from './admin.middleware';
import { authenticateToken } from '../auth/auth.middleware';
import {
    listUsers, banUser, unbanUser, getCharactersByUser, getCharacterDetails,
    teleportCharacter, viewInventory, broadcastMessage, sendSystemMail,
    getServerStatus, startServer, stopServer, listMaps, toggleMap,
    listPackages, createPackage, updatePackage, deletePackage,
    listOnlines, banCharacter, muteCharacter, setServerRates, createPromoCode
} from './admin.controller';

const router = Router();

// All routes require login + admin role
router.use(authenticateToken, isAdmin);

// Player & Character Management
router.get('/users', listUsers);
router.post('/users/:userId/ban', banUser);
router.post('/users/:userId/unban', unbanUser);
router.get('/users/:userId/characters', getCharactersByUser);

router.get('/characters/:charId', getCharacterDetails);
router.post('/characters/:charId/teleport', teleportCharacter);
router.post('/characters/:charId/ban', banCharacter);
router.post('/characters/:charId/mute', muteCharacter);
router.get('/characters/:charId/inventory', viewInventory);
router.get('/onlines', listOnlines);

router.post('/broadcast', broadcastMessage);
router.post('/mail', sendSystemMail);
router.post('/server/rates', setServerRates);
router.post('/promo-codes', createPromoCode);

// Server Control
router.get('/server/status', getServerStatus);
router.post('/server/start', startServer);
router.post('/server/stop', stopServer);
router.get('/server/maps', listMaps);
router.post('/server/maps/:mapId/toggle', toggleMap);

// Store Management
router.get('/store/packages', listPackages);
router.post('/store/packages', createPackage);
router.put('/store/packages/:id', updatePackage);
router.delete('/store/packages/:id', deletePackage);

export default router;
