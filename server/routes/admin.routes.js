import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard', (req, res) => {
  res.json({ status: 'success', message: 'Admin dashboard' });
});

export default router;
