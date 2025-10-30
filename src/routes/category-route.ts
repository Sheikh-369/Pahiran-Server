import express,{ Router } from 'express';
import {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/category-controller';
import asyncErrorHandler from '../services/async-error-handler';

const router:Router =express.Router();

router.route('/category').get(asyncErrorHandler(getAllCategories));
router.route('/category').post(asyncErrorHandler(createCategory));
router.route('/category/:id').get(asyncErrorHandler(getCategoryById));
router.route('/category/:id').get(asyncErrorHandler(updateCategory));
router.route('/category/:id').patch(asyncErrorHandler(updateCategory));
router.route('/category/:id').delete(asyncErrorHandler(deleteCategory));

export default router;
