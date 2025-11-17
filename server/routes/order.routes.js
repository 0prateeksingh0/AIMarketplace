import express from 'express';
import * as orderController from '../controllers/order.controller.js';
import { protect, hasActiveStore } from '../middleware/auth.js';
import { orderValidation, paginationValidation, idValidation } from '../middleware/validation.js';

const router = express.Router();

router.use(protect);

// User orders
router.get('/', paginationValidation, orderController.getUserOrders);
router.get('/store', hasActiveStore, paginationValidation, orderController.getStoreOrders);
router.get('/:id', idValidation, orderController.getOrder);

// Create order
router.post('/', orderValidation.create, orderController.createOrder);

// Update order status (store owners)
router.patch('/:id/status', hasActiveStore, idValidation, orderController.updateOrderStatus);

export default router;
