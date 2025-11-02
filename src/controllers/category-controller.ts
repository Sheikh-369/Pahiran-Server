import { Request, Response } from 'express';
import Category from '../database/models/category-model';

// Seed default categories
// Standalone seed function (no req/res)
export const seedDefaultCategories = async () => {
  const categories = [
    { categoryName: 'Ladies Items', categoryDescription: 'Clothing and accessories for ladies' },
    { categoryName: 'Gents Items', categoryDescription: 'Clothing and accessories for gents' },
    { categoryName: 'Kids Items', categoryDescription: 'Clothing and accessories for kids' },
  ];

  for (const cat of categories) {
    await Category.findOrCreate({
      where: { categoryName: cat.categoryName },
      defaults: cat,
    });
  }

  console.log('✅Categories seeded successfully');
};


// Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
  const categories = await Category.findAll();
  res.status(200).json({ message: 'Categories fetched successfully.',categories });
};

// Create new category
export const createCategory = async (req: Request, res: Response) => {
  const { categoryName, categoryDescription } = req.body;

  if (!categoryName) {
    return res.status(400).json({ message: 'categoryName is required' });
  }

  const [category, created] = await Category.findOrCreate({
    where: { categoryName },
    defaults: { categoryName, categoryDescription: categoryDescription || null },
  });

  res.status(created ? 201 : 200).json({
    message: created ? 'Category created successfully' : 'Category already exists',
    category,
  });
};

// Get single category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await Category.findByPk(id, {
    include: ['subCategories', 'products'],
  });

  if (!category) {
    return res.status(404).json({ message: 'Category not found!' });
  }

  res.status(200).json({ message: 'Category fetched Successfully.',category });
};

// Update category
export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { categoryName, categoryDescription } = req.body;

  const category = await Category.findByPk(id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found!' });
  }

  if (categoryName) category.categoryName = categoryName;
  if (categoryDescription) category.categoryDescription = categoryDescription;

  await category.save();

  res.status(200).json({
    message: 'Category updated successfully!',
    category,
  });
};

// Delete category
export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await Category.findByPk(id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found!' });
  }

  await category.destroy();

  res.status(200).json({
    message: 'Category deleted successfully!',
  });
};


