import express from 'express';
import * as storeController from '../controllers/store.controller.js';
import { protect } from '../middleware/auth.js';
import { storeValidation, paginationValidation, idValidation } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', paginationValidation, storeController.getAllStores);
router.get('/username/:username', storeController.getStoreByUsername);
router.get('/:id', idValidation, storeController.getStore);

// Protected routes
router.use(protect);
router.get('/my/store', storeController.getMyStore);
router.post('/', storeValidation.create, storeController.createStore);
router.patch('/:id', idValidation, storeController.updateStore);

export default router;
