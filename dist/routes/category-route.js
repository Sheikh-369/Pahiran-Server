"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category-controller");
const async_error_handler_1 = __importDefault(require("../services/async-error-handler"));
const router = express_1.default.Router();
router.route('/category').get((0, async_error_handler_1.default)(category_controller_1.getAllCategories));
router.route('/category').post((0, async_error_handler_1.default)(category_controller_1.createCategory));
router.route('/category/:id').get((0, async_error_handler_1.default)(category_controller_1.getCategoryById));
router.route('/category/:id').get((0, async_error_handler_1.default)(category_controller_1.updateCategory));
router.route('/category/:id').patch((0, async_error_handler_1.default)(category_controller_1.updateCategory));
router.route('/category/:id').delete((0, async_error_handler_1.default)(category_controller_1.deleteCategory));
exports.default = router;
