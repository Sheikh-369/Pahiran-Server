import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Category from './category-model';
import SubCategory from './sub-category-model';

@Table({
  tableName: 'products',
  modelName: 'Product',
  timestamps: true,
})
class Product extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare productName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare productDescription: string | null;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare productPrice: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare productBrand: string | null;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  declare productStock: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare productImage: string | null;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare isFeatured: boolean;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare categoryId: string;

  @BelongsTo(() => Category)
  declare category?: Category;

  @ForeignKey(() => SubCategory)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare subCategoryId: string | null;

  @BelongsTo(() => SubCategory)
  declare subCategory?: SubCategory;
}

export default Product;
