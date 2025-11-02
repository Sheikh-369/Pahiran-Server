"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const product_model_1 = __importDefault(require("../database/models/product-model"));
// Create a new product
const createProduct = async (req, res) => {
    const { productName, productDescription, productPrice, productBrand, productStock, isFeatured, categoryId, subCategoryId, } = req.body;
    const productImage = req.file ? req.file.path : "https://www.anonymouspotato.com/cdn/shop/products/vodkastarterkit_1200x.jpg?v=1604695410";
    if (!productName || !productPrice || !categoryId) {
        return res.status(400).json({ message: 'Please provide productName, productPrice, and categoryId!' });
    }
    const product = await product_model_1.default.create({
        productName,
        productDescription: productDescription || null,
        productPrice,
        productBrand: productBrand || null,
        productStock: productStock || 0,
        productImage: productImage || null,
        isFeatured: isFeatured || false,
        categoryId,
        subCategoryId: subCategoryId || null,
    });
    res.status(200).json({
        message: 'Product created successfully!',
        product,
    });
};
exports.createProduct = createProduct;
// Get all products
const getAllProducts = async (_req, res) => {
    const products = await product_model_1.default.findAll({
        include: ['category', 'subCategory'],
    });
    res.status(200).json({ message: 'Products fetched successfully.', products });
};
exports.getAllProducts = getAllProducts;
// Get single product by ID
const getProductById = async (req, res) => {
    const { id } = req.params;
    const product = await product_model_1.default.findByPk(id, { include: ['category', 'subCategory'] });
    if (!product) {
        return res.status(404).json({ message: 'Product not found!' });
    }
    res.status(200).json({ message: 'Product fetched successfully.', product });
};
exports.getProductById = getProductById;
// Update product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { productName, productDescription, productPrice, productBrand, productStock, productImage, isFeatured, categoryId, subCategoryId, } = req.body;
    const product = await product_model_1.default.findByPk(id);
    if (!product) {
        return res.status(404).json({ message: 'Product not found!' });
    }
    if (productName)
        product.productName = productName;
    if (productDescription !== undefined)
        product.productDescription = productDescription;
    if (productPrice !== undefined)
        product.productPrice = productPrice;
    if (productBrand !== undefined)
        product.productBrand = productBrand;
    if (productStock !== undefined)
        product.productStock = productStock;
    if (productImage !== undefined)
        product.productImage = productImage;
    if (isFeatured !== undefined)
        product.isFeatured = isFeatured;
    if (categoryId)
        product.categoryId = categoryId;
    if (subCategoryId !== undefined)
        product.subCategoryId = subCategoryId;
    await product.save();
    res.status(200).json({
        message: 'Product updated successfully!',
        product,
    });
};
exports.updateProduct = updateProduct;
// Delete product
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const product = await product_model_1.default.findByPk(id);
    if (!product) {
        return res.status(404).json({ message: 'Product not found!' });
    }
    await product.destroy();
    res.status(200).json({ message: 'Product deleted successfully!' });
};
exports.deleteProduct = deleteProduct;
