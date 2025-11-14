import express from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, (req, res) => {
  res.json({ status: 'success', message: 'Rating routes' });
});

export default router;
