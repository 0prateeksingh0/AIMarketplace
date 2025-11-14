import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/profile', (req, res) => {
  res.json({ status: 'success', data: { user: req.user } });
});

export default router;
