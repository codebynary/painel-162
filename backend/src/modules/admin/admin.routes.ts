import { Router } from 'express';
import { isAdmin } from './admin.middleware';
import { authenticateToken } from '../auth/auth.middleware';
import {
    listUsers,
    banUser,
    unbanUser,
    getCharacterDetails,
    teleportCharacter,
    viewInventory,
    getCharactersByUser,
    broadcastMessage,
    sendSystemMail,
    getServerStatus,
    startServer,
    stopServer,
    listMaps,
    toggleMap,
    listPackages,
    createPackage,
    updatePackage,
    deletePackage
} from './admin.controller';

const router = Router();

// All routes require login + admin role
router.use(authenticateToken, isAdmin);

router.get('/users', listUsers);
router.post('/users/:userId/ban', banUser);
router.post('/users/:userId/unban', unbanUser);
router.get('/users/:userId/characters', getCharactersByUser);
router.get('/users/:userId/characters', getCharactersByUser);

router.get('/characters/:charId', getCharacterDetails);
router.post('/characters/:charId/teleport', teleportCharacter);
router.get('/characters/:charId/inventory', viewInventory);

router.post('/broadcast', broadcastMessage);
router.post('/mail', sendSystemMail);

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
