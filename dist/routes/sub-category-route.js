"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const async_error_handler_1 = __importDefault(require("../services/async-error-handler"));
const sub_category_controller_1 = require("../controllers/sub-category-controller");
const router = express_1.default.Router();
router.route('/sub-category').get((0, async_error_handler_1.default)(sub_category_controller_1.getAllSubCategories));
router.route('/sub-category').post((0, async_error_handler_1.default)(sub_category_controller_1.createSubCategory));
router.route('/subu-category/:id').get((0, async_error_handler_1.default)(sub_category_controller_1.getSubCategoryById));
router.route('/sub-category/:id').get((0, async_error_handler_1.default)(sub_category_controller_1.updateSubCategory));
router.route('/sub-category/:id').patch((0, async_error_handler_1.default)(sub_category_controller_1.updateSubCategory));
router.route('/sub-category/:id').delete((0, async_error_handler_1.default)(sub_category_controller_1.deleteSubCategory));
exports.default = router;
