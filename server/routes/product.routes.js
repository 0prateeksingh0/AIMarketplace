import express from 'express';
import * as productController from '../controllers/product.controller.js';
import { protect, hasActiveStore } from '../middleware/auth.js';
import { productValidation, idValidation, paginationValidation } from '../middleware/validation.js';

const router = express.Router();

router.get('/', paginationValidation, productController.getAllProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', idValidation, productController.getProduct);

router.use(protect, hasActiveStore);
router.post('/', productValidation.create, productController.createProduct);
router.patch('/:id', idValidation, productValidation.update, productController.updateProduct);
router.delete('/:id', idValidation, productController.deleteProduct);

export default router;
