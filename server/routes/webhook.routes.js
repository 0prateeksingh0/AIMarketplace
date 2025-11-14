import express from 'express';

const router = express.Router();

router.post('/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  res.json({ received: true });
});

export default router;
