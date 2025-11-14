import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Order routes' });
});

export default router;
