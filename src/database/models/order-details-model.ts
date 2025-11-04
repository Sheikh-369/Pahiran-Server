import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Order from './order-model';
import Product from './product-model';

@Table({
  tableName: 'orderDetails',
  modelName: 'OrderDetails',
  timestamps: true,
})
class OrderDetails extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @ForeignKey(() => Order)
  @Column({ type: DataType.UUID, allowNull: false })
  declare orderId: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.UUID, allowNull: false })
  declare productId: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare orderQuantity: number;

  @BelongsTo(() => Order)
  order?: Order;

  @BelongsTo(() => Product)
  product?: Product;
}

export default OrderDetails;
