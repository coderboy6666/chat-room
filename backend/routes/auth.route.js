import express from 'express'
import { checkController, loginController, logoutController, registerController, updateController } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', loginController);

router.post('/logout', logoutController);

router.post('/register', registerController);

router.put('/update', protectRoute, updateController);

router.get('/check', protectRoute, checkController);

export default router;