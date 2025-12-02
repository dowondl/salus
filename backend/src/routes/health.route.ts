import express from 'express';
import healthController from '../controllers/health.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/log', authMiddleware, healthController.createLog);
router.get('/summary', authMiddleware, healthController.getSummary);
router.post('/internal/ai/result', healthController.handleAiResult);

export default router;