import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import Category from './category-model';
import Product from './product-model';

@Table({
  tableName: 'subCategories',
  modelName: 'SubCategory',
  timestamps: true,
})
class SubCategory extends Model {
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
  declare subCategoryName: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: true, // optional
  })
  declare categoryId: string | null;

  @BelongsTo(() => Category)
  declare category?: Category;

  @HasMany(() => Product, { foreignKey: 'subCategoryId' })
  declare products?: Product[];
}

export default SubCategory;
