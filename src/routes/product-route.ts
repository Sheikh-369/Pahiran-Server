import express,{ Router } from 'express';
import asyncErrorHandler from '../services/async-error-handler';
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../controllers/product-controller';
import upload from '../middleware/multer-upload';

const router:Router =express.Router();

router.route('/product').get(asyncErrorHandler(getAllProducts));

router.route('/product').post(
    upload.single("productImage"),
    asyncErrorHandler(createProduct)
);

router.route('/product/:id').get(asyncErrorHandler(getProductById));

router.route('/product/:id').get(asyncErrorHandler(updateProduct));

router.route('/product/:id').patch(
    upload.single("productImage"),
    asyncErrorHandler(updateProduct)
);

router.route('/product/:id').delete(asyncErrorHandler(deleteProduct));

export default router