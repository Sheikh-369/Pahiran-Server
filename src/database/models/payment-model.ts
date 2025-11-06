import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Order from "./order-model";

@Table({
  tableName: "payments",
  modelName: "Payment",
  timestamps: true,
})
class Payment extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @ForeignKey(() => Order)
  @Column({ type: DataType.UUID, allowNull: false })
  declare orderId: string;

  // 👇 Only two payment methods: COD or QR
  @Column({
    type: DataType.ENUM("cod", "qr"),
    allowNull: false,
  })
  declare paymentMethod: "cod" | "qr";

  // 👇 Status: pending / completed / failed
  @Column({
    type: DataType.ENUM("pending", "paid", "failed"),
    defaultValue: "pending",
  })
  declare paymentStatus: "pending" | "paid" | "failed";

  // 👇 Optional field for QR screenshot (Cloudinary URL)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare qrScreenshot: string | null;

  @BelongsTo(() => Order)
  declare order?: Order;
}

export default Payment;
