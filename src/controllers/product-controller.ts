import { Request, Response } from 'express';
import Product from '../database/models/product-model';
import Category from '../database/models/category-model';
import { Op } from 'sequelize';


// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  const {
    productName,
    productDescription,
    productPrice,
    productBrand,
    productStock,
    isFeatured,
    categoryId,
    subCategoryId,
  } = req.body;

  const productImage=req.file?req.file.path:"https://www.anonymouspotato.com/cdn/shop/products/vodkastarterkit_1200x.jpg?v=1604695410"

  if (!productName || !productPrice || !categoryId) {
    return res.status(400).json({ message: 'Please provide productName, productPrice, and categoryId!' });
  }

  const product = await Product.create({
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

// Get all products
export const getAllProducts = async (_req: Request, res: Response) => {
  const products = await Product.findAll({
    include: ['category', 'subCategory'],
  });

  res.status(200).json({message: 'Products fetched successfully.', products });
};

// Get single product by ID
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findByPk(id, { include: ['category', 'subCategory'] });

  if (!product) {
    return res.status(404).json({ message: 'Product not found!' });
  }

  res.status(200).json({message: 'Product fetched successfully.', product });
};

// Update product
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    productName,
    productDescription,
    productPrice,
    productBrand,
    productStock,
    productImage,
    isFeatured,
    categoryId,
    subCategoryId,
  } = req.body;

  const product = await Product.findByPk(id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found!' });
  }

  if (productName) product.productName = productName;
  if (productDescription !== undefined) product.productDescription = productDescription;
  if (productPrice !== undefined) product.productPrice = productPrice;
  if (productBrand !== undefined) product.productBrand = productBrand;
  if (productStock !== undefined) product.productStock = productStock;
  if (productImage !== undefined) product.productImage = productImage;
  if (isFeatured !== undefined) product.isFeatured = isFeatured;
  if (categoryId) product.categoryId = categoryId;
  if (subCategoryId !== undefined) product.subCategoryId = subCategoryId;

  await product.save();

  res.status(200).json({
    message: 'Product updated successfully!',
    product,
  });
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findByPk(id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found!' });
  }

  await product.destroy();

  res.status(200).json({ message: 'Product deleted successfully!' });
};

//Fetch product by category
export const getByCategory = async (req: Request, res: Response) => {
  const { categoryName } = req.params;

  if (!categoryName) {
    return res.status(400).json({ message: "categoryName is required!" });
  }

  const products = await Product.findAll({
    include: [
      {
        model: Category,
        where: {
          categoryName: {
            [Op.iLike]: categoryName, // Case-insensitive match
          },
        },
        attributes: ['categoryName'],
      },
    ],
  });

  if (products.length === 0) {
    return res.status(404).json({
      message: `No products found for category "${categoryName}"`,
    });
  }

  res.status(200).json({
    message: `${categoryName} products fetched successfully`,
    data: products,
  });
};
