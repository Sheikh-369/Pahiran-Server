

export enum PaymentMethods {
  COD = "cod",
  QR = "qr",
}

export enum OrderStatus {
  Pending = "pending",
  Preparing = "preparing",
  Shipped = "shipped",
  Delivered = "delivered",
  Cancelled = "cancelled",
}

export enum PaymentStatus {
  Pending = "pending",
  Paid = "paid",
  Failed = "failed",
}
