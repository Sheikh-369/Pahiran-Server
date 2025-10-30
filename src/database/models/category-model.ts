import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import SubCategory from './sub-category-model';
import Product from './product-model';

@Table({
  tableName: 'categories',
  modelName: 'Category',
  timestamps: true,
})
class Category extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare categoryName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare categoryDescription: string | null;

  @HasMany(() => SubCategory, { foreignKey: 'categoryId' })
  declare subCategories?: SubCategory[];

  @HasMany(() => Product)
  declare products?: Product[];
}

export default Category;
