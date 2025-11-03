import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import User from "./user-model";
import Product from "./product-model";


@Table({
  tableName: "carts",
  modelName: "Cart",
  timestamps: true,
  paranoid: true, // enables soft delete (deletedAt column)
})
class Cart extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  // The user who owns this cart item
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  // The product added to the cart
  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare productId: string;

  // Quantity of the product
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  declare quantity: number;

  // Relation to product
  @BelongsTo(() => Product, {
    onDelete: "CASCADE", // if product is deleted, remove this cart item
  })
  declare product: Product;

  // Relation to user
  @BelongsTo(() => User)
  declare user: User;
}

export default Cart;
