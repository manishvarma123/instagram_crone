import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import sendMessage from '../controllers/message/sendMessage.js';
import getMessage from '../controllers/message/getMessage.js';

const router = express.Router();

router.post('/send/:id', isAuthenticated, sendMessage);
router.get('/all/:id', isAuthenticated, getMessage);

export default router;