"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const async_error_handler_1 = __importDefault(require("../services/async-error-handler"));
const product_controller_1 = require("../controllers/product-controller");
const multer_upload_1 = __importDefault(require("../middleware/multer-upload"));
const router = express_1.default.Router();
router.route('/product').get((0, async_error_handler_1.default)(product_controller_1.getAllProducts));
router.route('/product').post(multer_upload_1.default.single("productImage"), (0, async_error_handler_1.default)(product_controller_1.createProduct));
router.route('/product/:id').get((0, async_error_handler_1.default)(product_controller_1.getProductById));
router.route('/product/:id').get((0, async_error_handler_1.default)(product_controller_1.updateProduct));
router.route('/product/:id').patch(multer_upload_1.default.single("productImage"), (0, async_error_handler_1.default)(product_controller_1.updateProduct));
router.route('/product/:id').delete((0, async_error_handler_1.default)(product_controller_1.deleteProduct));
exports.default = router;
