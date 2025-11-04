import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import OrderDetails from "./order-details-model";
import Payment from "./payment-model";

@Table({
  tableName: "orders",
  modelName: "Order",
  timestamps: true,
})
class Order extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare firstName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare lastName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare phoneNumber: string;

  // 👇 Email optional, as you said
  @Column({ type: DataType.STRING, allowNull: true })
  declare email: string | null;

  @Column({ type: DataType.STRING, allowNull: false })
  declare province: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare district: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare city: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare tole: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare totalAmount: number;

  @Column({
    type: DataType.ENUM(
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled"
    ),
    defaultValue: "pending",
  })
  declare orderStatus: string;

  // 👇 This creates a direct one-to-one relationship with Payment
  @ForeignKey(() => Payment)
  @Column({ type: DataType.UUID, allowNull: true })
  declare paymentId: string | null;

  @BelongsTo(() => Payment)
  declare payment?: Payment;

  // 👇 Each order can have multiple orderDetails
  @HasMany(() => OrderDetails)
  declare orderDetails?: OrderDetails[];
}

export default Order;
