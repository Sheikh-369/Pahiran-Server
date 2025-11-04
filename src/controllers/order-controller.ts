import { Request, Response } from "express";
import Order from "../database/models/order-model";
import { OrderStatus, PaymentMethods, PaymentStatus } from "../global/type";
import Payment from "../database/models/payment-model";
import OrderDetails from "../database/models/order-details-model";
import Cart from "../database/models/cart-model";

interface OrderRequest extends Request {
  user?: {
    id: string;
  };
}

interface IProduct {
  productId: string;
  orderQuantity: number;
}

class OrderController {
  async createOrder(req: OrderRequest, res: Response) {
    const userId = req.user?.id;

    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      province,
      district,
      city,
      tole,
      totalAmount,
      paymentMethod,
      products,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !province ||
      !district ||
      !city ||
      !tole ||
      !totalAmount ||
      !paymentMethod ||
      !products ||
      products.length === 0
    ) {
      return res.status(400).json({ message: "Please fill all required fields!" });
    }

    // Create the order
    const orderData = await Order.create({
      firstName,
      lastName,
      phoneNumber,
      email: email || null,
      province,
      district,
      city,
      tole,
      totalAmount,
      userId,
      orderStatus: OrderStatus.Pending,
    });

    // Handle Payment separately
    let paymentData;

    if (paymentMethod === PaymentMethods.COD) {
      // Cash on Delivery
      paymentData = await Payment.create({
        orderId: orderData.id,
        paymentMethod: PaymentMethods.COD,
        paymentStatus: PaymentStatus.Pending, // Will be updated once delivered
        qrScreenshot: null,
      });
    } else if (paymentMethod === PaymentMethods.QR) {
      // QR Payment requires screenshot
      if (!req.file) {
        return res.status(400).json({ message: "Please upload QR payment screenshot!" });
      }

      paymentData = await Payment.create({
        orderId: orderData.id,
        paymentMethod: PaymentMethods.QR,
        paymentStatus: PaymentStatus.Pending, // Will be verified later
        qrScreenshot: req.file.path, // Cloudinary URL
      });
    } else {
      return res.status(400).json({ message: "Invalid payment method!" });
    }

    // Attach paymentId to order
    orderData.paymentId = paymentData.id;
    await orderData.save();

    // Create OrderDetails
    for (const product of products as IProduct[]) {
      await OrderDetails.create({
        orderId: orderData.id,
        productId: product.productId,
        orderQuantity: product.orderQuantity,
      });
    }

    // Remove products from cart
    const productIds = products.map((p: IProduct) => p.productId);
    await Cart.destroy({
      where: {
        userId,
        productId: productIds,
      },
    });

    return res.status(200).json({
      message: `Order created successfully with ${paymentMethod} payment!`,
      data: {
        orderId: orderData.id,
        paymentId: paymentData.id,
      },
    });
  }
}

export default new OrderController();
