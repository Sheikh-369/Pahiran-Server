import express,{ Router } from 'express';
import asyncErrorHandler from '../services/async-error-handler';
import { createSubCategory, deleteSubCategory, getAllSubCategories, getSubCategoryById, updateSubCategory } from '../controllers/sub-category-controller';

const router:Router =express.Router();

router.route('/sub-category').get(asyncErrorHandler(getAllSubCategories));
router.route('/sub-category').post(asyncErrorHandler(createSubCategory));
router.route('/subu-category/:id').get(asyncErrorHandler(getSubCategoryById));
router.route('/sub-category/:id').get(asyncErrorHandler(updateSubCategory));
router.route('/sub-category/:id').patch(asyncErrorHandler(updateSubCategory));
router.route('/sub-category/:id').delete(asyncErrorHandler(deleteSubCategory));

export default router;
