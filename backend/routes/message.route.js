import express from 'express';
import { getRecordController, getUserForSidebarController, sendMessageController } from '../controllers/message.controller.js';
import { protectRoute } from './../middleware/auth.middleware.js';

const router = express.Router();

router.get('/sidebar', protectRoute, getUserForSidebarController);

router.get('/getRecord/:id', protectRoute, getRecordController);

router.post('/sendMessage/:id', protectRoute, sendMessageController);

export default router;