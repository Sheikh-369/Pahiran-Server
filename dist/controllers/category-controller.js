"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.createCategory = exports.getAllCategories = exports.seedDefaultCategories = void 0;
const category_model_1 = __importDefault(require("../database/models/category-model"));
// Seed default categories
// Standalone seed function (no req/res)
const seedDefaultCategories = async () => {
    const categories = [
        { categoryName: 'Ladies Items', categoryDescription: 'Clothing and accessories for ladies' },
        { categoryName: 'Gents Items', categoryDescription: 'Clothing and accessories for gents' },
        { categoryName: 'Kids Items', categoryDescription: 'Clothing and accessories for kids' },
    ];
    for (const cat of categories) {
        await category_model_1.default.findOrCreate({
            where: { categoryName: cat.categoryName },
            defaults: cat,
        });
    }
    console.log('Categories seeded successfully');
};
exports.seedDefaultCategories = seedDefaultCategories;
// Get all categories
const getAllCategories = async (req, res) => {
    const categories = await category_model_1.default.findAll();
    res.status(200).json({ message: 'Categories fetched successfully.', categories });
};
exports.getAllCategories = getAllCategories;
// Create new category
const createCategory = async (req, res) => {
    const { categoryName, categoryDescription } = req.body;
    if (!categoryName) {
        return res.status(400).json({ message: 'categoryName is required' });
    }
    const [category, created] = await category_model_1.default.findOrCreate({
        where: { categoryName },
        defaults: { categoryName, categoryDescription: categoryDescription || null },
    });
    res.status(created ? 201 : 200).json({
        message: created ? 'Category created successfully' : 'Category already exists',
        category,
    });
};
exports.createCategory = createCategory;
// Get single category by ID
const getCategoryById = async (req, res) => {
    const { id } = req.params;
    const category = await category_model_1.default.findByPk(id, {
        include: ['subCategories', 'products'],
    });
    if (!category) {
        return res.status(404).json({ message: 'Category not found!' });
    }
    res.status(200).json({ message: 'Category fetched Successfully.', category });
};
exports.getCategoryById = getCategoryById;
// Update category
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { categoryName, categoryDescription } = req.body;
    const category = await category_model_1.default.findByPk(id);
    if (!category) {
        return res.status(404).json({ message: 'Category not found!' });
    }
    if (categoryName)
        category.categoryName = categoryName;
    if (categoryDescription)
        category.categoryDescription = categoryDescription;
    await category.save();
    res.status(200).json({
        message: 'Category updated successfully!',
        category,
    });
};
exports.updateCategory = updateCategory;
// Delete category
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    const category = await category_model_1.default.findByPk(id);
    if (!category) {
        return res.status(404).json({ message: 'Category not found!' });
    }
    await category.destroy();
    res.status(200).json({
        message: 'Category deleted successfully!',
    });
};
exports.deleteCategory = deleteCategory;
