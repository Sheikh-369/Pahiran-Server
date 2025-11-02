import { Request, Response } from 'express';
import SubCategory from '../database/models/sub-category-model';

// Seed default subcategories
export const seedSubCategories = async () => {
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
    await SubCategory.findOrCreate({
      where: { subCategoryName: name },
      defaults: { subCategoryName: name },
    });
  }

  console.log('✅Subcategories seeded successfully');
};

// Create a new subcategory
export const createSubCategory = async (req: Request, res: Response) => {
  const { subCategoryName } = req.body;

  if (!subCategoryName) {
    return res.status(400).json({ message: 'Please provide subCategoryName!' });
  }

  const subCategory = await SubCategory.create({ subCategoryName });

  res.status(200).json({
    message: 'SubCategory created successfully!',
    subCategory,
  });
};

// Get all subcategories
export const getAllSubCategories = async (req: Request, res: Response) => {
  const subCategories = await SubCategory.findAll();
  res.status(200).json({message: 'SubCategories fetched successfully!', subCategories });
};

// Get single subcategory by ID
export const getSubCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const subCategory = await SubCategory.findByPk(id);

  if (!subCategory) {
    return res.status(404).json({ message: 'SubCategory not found!' });
  }

  res.status(200).json({message: 'SubCategory fetched successfully!', subCategory });
};

// Update subcategory
export const updateSubCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { subCategoryName } = req.body;

  const subCategory = await SubCategory.findByPk(id);
  if (!subCategory) {
    return res.status(404).json({ message: 'SubCategory not found!' });
  }

  if (subCategoryName) subCategory.subCategoryName = subCategoryName;

  await subCategory.save();

  res.status(200).json({
    message: 'SubCategory updated successfully!',
    subCategory,
  });
};

// Delete subcategory
export const deleteSubCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  const subCategory = await SubCategory.findByPk(id);
  if (!subCategory) {
    return res.status(404).json({ message: 'SubCategory not found!' });
  }

  await subCategory.destroy();

  res.status(200).json({ message: 'SubCategory deleted successfully!' });
};