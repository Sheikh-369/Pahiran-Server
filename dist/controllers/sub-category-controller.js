"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubCategory = exports.updateSubCategory = exports.getSubCategoryById = exports.getAllSubCategories = exports.createSubCategory = exports.seedSubCategories = void 0;
const sub_category_model_1 = __importDefault(require("../database/models/sub-category-model"));
// Seed default subcategories
const seedSubCategories = async () => {
    const subCategories = [
        'Shirts',
        'Pants',
        'Kurthi',
        'Jeans',
        'Boys',
        'Girls',
        'Baby',
    ];
    for (const name of subCategories) {
        await sub_category_model_1.default.findOrCreate({
            where: { subCategoryName: name },
            defaults: { subCategoryName: name },
        });
    }
    console.log('Subcategories seeded successfully');
};
exports.seedSubCategories = seedSubCategories;
// Create a new subcategory
const createSubCategory = async (req, res) => {
    const { subCategoryName } = req.body;
    if (!subCategoryName) {
        return res.status(400).json({ message: 'Please provide subCategoryName!' });
    }
    const subCategory = await sub_category_model_1.default.create({ subCategoryName });
    res.status(200).json({
        message: 'SubCategory created successfully!',
        subCategory,
    });
};
exports.createSubCategory = createSubCategory;
// Get all subcategories
const getAllSubCategories = async (req, res) => {
    const subCategories = await sub_category_model_1.default.findAll();
    res.status(200).json({ message: 'SubCategories fetched successfully!', subCategories });
};
exports.getAllSubCategories = getAllSubCategories;
// Get single subcategory by ID
const getSubCategoryById = async (req, res) => {
    const { id } = req.params;
    const subCategory = await sub_category_model_1.default.findByPk(id);
    if (!subCategory) {
        return res.status(404).json({ message: 'SubCategory not found!' });
    }
    res.status(200).json({ message: 'SubCategory fetched successfully!', subCategory });
};
exports.getSubCategoryById = getSubCategoryById;
// Update subcategory
const updateSubCategory = async (req, res) => {
    const { id } = req.params;
    const { subCategoryName } = req.body;
    const subCategory = await sub_category_model_1.default.findByPk(id);
    if (!subCategory) {
        return res.status(404).json({ message: 'SubCategory not found!' });
    }
    if (subCategoryName)
        subCategory.subCategoryName = subCategoryName;
    await subCategory.save();
    res.status(200).json({
        message: 'SubCategory updated successfully!',
        subCategory,
    });
};
exports.updateSubCategory = updateSubCategory;
// Delete subcategory
const deleteSubCategory = async (req, res) => {
    const { id } = req.params;
    const subCategory = await sub_category_model_1.default.findByPk(id);
    if (!subCategory) {
        return res.status(404).json({ message: 'SubCategory not found!' });
    }
    await subCategory.destroy();
    res.status(200).json({ message: 'SubCategory deleted successfully!' });
};
exports.deleteSubCategory = deleteSubCategory;
