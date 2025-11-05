// import { Request, Response } from "express";
// import Order from "../database/models/order-model";
// import { OrderStatus, PaymentMethods, PaymentStatus } from "../global/type";
// import Payment from "../database/models/payment-model";
// import OrderDetails from "../database/models/order-details-model";
// import Cart from "../database/models/cart-model";

// interface OrderRequest extends Request {
//   user?: {
//     id: string;
//   };
// }

// interface IProduct {
//   productId: string;
//   orderQuantity: number;
// }

// class OrderController {
//   async createOrder(req: OrderRequest, res: Response) {
//     const userId = req.user?.id || null

//     const {
//       firstName,
//       lastName,
//       phoneNumber,
//       email,
//       province,
//       district,
//       city,
//       tole,
//       totalAmount,
//       paymentMethod
//     } = req.body;
//     const products: IProduct[] = req.body.products;

//     if (
//       !firstName ||
//       !lastName ||
//       !phoneNumber ||
//       !province ||
//       !district ||
//       !city ||
//       !tole ||
//       !totalAmount ||
//       !paymentMethod ||
//       !products ||
//       products.length === 0
//     ) {
//       return res.status(400).json({ message: "Please fill all required fields!" });
//     }

//     // Create the order
//     const orderData = await Order.create({
//       firstName,
//       lastName,
//       phoneNumber,
//       email: email || null,
//       province,
//       district,
//       city,
//       tole,
//       totalAmount,
//       userId,
//       orderStatus: OrderStatus.Pending,
//     });

//     // Create OrderDetails
//     for (const product of products as IProduct[]) {
//       await OrderDetails.create({
//         orderId: orderData.id,
//         productId: product.productId,
//         orderQuantity: product.orderQuantity,
//       });
//     }

//     // Handle Payment separately
//     let paymentData;

//     if (paymentMethod === PaymentMethods.COD) {
//       // Cash on Delivery
//       paymentData = await Payment.create({
//         orderId: orderData.id,
//         paymentMethod: PaymentMethods.COD,
//         paymentStatus: PaymentStatus.Pending, // Will be updated once delivered
//         qrScreenshot: null,
//       });
//     } else if (paymentMethod === PaymentMethods.QR) {
//       // QR Payment requires screenshot
//       if (!req.file) {
//         return res.status(400).json({ message: "Please upload QR payment screenshot!" });
//       }

//       paymentData = await Payment.create({
//         orderId: orderData.id,
//         paymentMethod: PaymentMethods.QR,
//         paymentStatus: PaymentStatus.Pending, // Will be verified later
//         qrScreenshot: req.file.path, // Cloudinary URL
//       });
//     } else {
//       return res.status(400).json({ message: "Invalid payment method!" });
//     }

//     // Attach paymentId to order
//     orderData.paymentId = paymentData.id;
//     await orderData.save();

//     // Remove products from cart
//     const productIds = products.map((p: IProduct) => p.productId);
//     await Cart.destroy({
//       where: {
//         userId,
//         productId: productIds,
//       },
//     });

//     return res.status(200).json({
//       message: `Order created successfully with ${paymentMethod} payment!`,
//       data: {
//         orderId: orderData.id,
//         paymentId: paymentData.id,
//       },
//     });
//   }
// }

// export default new OrderController();

//2nd
import { Request, Response } from "express";
import Order from "../database/models/order-model";
import { OrderStatus, PaymentMethods, PaymentStatus } from "../global/type";
import Payment from "../database/models/payment-model";
import OrderDetails from "../database/models/order-details-model";
import Cart from "../database/models/cart-model";
import { Op } from "sequelize";
import Product from "../database/models/product-model";

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
  //place an order
  async createOrder(req: OrderRequest, res: Response) {
    console.log("Body:",req.body)
    try {
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
      } = req.body;

      // ✅ Parse products (in case it's sent as JSON string in multipart/form-data)
      let products: IProduct[] = [];
      try {
        products =
          typeof req.body.products === "string"
            ? JSON.parse(req.body.products)
            : req.body.products;
      } catch (err) {
        return res
          .status(400)
          .json({ message: "Invalid products data format!" });
      }

      // ✅ Validate required fields
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
        return res
          .status(400)
          .json({ message: "Please fill all required fields!" });
      }

      // ✅ Create the order
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

      // ✅ Create OrderDetails for each product
      for (const product of products) {
        if (!product.productId || !product.orderQuantity) {
          console.error("⚠️ Skipping invalid product:", product);
          continue;
        }

        await OrderDetails.create({
          orderId: orderData.id,
          productId: product.productId,
          orderQuantity: product.orderQuantity,
        });
      }

      // ✅ Handle Payment creation
      let paymentData;

      if (paymentMethod === PaymentMethods.COD) {
        // Cash on Delivery
        paymentData = await Payment.create({
          orderId: orderData.id,
          paymentMethod: PaymentMethods.COD,
          paymentStatus: PaymentStatus.Pending,
          qrScreenshot: null,
        });
      } else if (paymentMethod === PaymentMethods.QR) {
        // QR Payment
        if (!req.file) {
          return res
            .status(400)
            .json({ message: "Please upload QR payment screenshot!" });
        }

        paymentData = await Payment.create({
          orderId: orderData.id,
          paymentMethod: PaymentMethods.QR,
          paymentStatus: PaymentStatus.Pending,
          qrScreenshot: req.file.path, // Assuming Cloudinary URL or file path
        });
      } else {
        return res.status(400).json({ message: "Invalid payment method!" });
      }

      // ✅ Attach paymentId to the order
      orderData.paymentId = paymentData.id;
      await orderData.save();

      // ✅ Remove ordered products from user's cart
      const productIds = products.map((p) => p.productId);
      console.log("🧾 Deleting from cart:", { userId, productIds });
      await Cart.destroy({
        where: {
          userId,
          productId: { [Op.in]: productIds },
        },
      });


      // ✅ Success response
      return res.status(201).json({
        message: `Order created successfully with ${paymentMethod} payment!`,
        data: {
          orderId: orderData.id,
          paymentId: paymentData.id,
        },
      });
    } catch (error: any) {
      console.error("❌ Error creating order:", error);
      return res
        .status(500)
        .json({ message: "Server error while creating order!", error });
    }
  }

  //fetch my orders
  async getMyOrders (req: OrderRequest, res: Response){
    const userId = req.user?.id;

    const orders = await Order.findAll({
      where: { userId },
      attributes: ["id", "totalAmount", "createdAt","orderStatus"],
      include: [
        {
          model: Payment,
          as: "payment",
          attributes: ["paymentStatus"]
        },
        {
          model: OrderDetails,
          as: "orderDetails",
          attributes: ["orderQuantity"],
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["productName", "productImage", "productPrice"]
            }
          ]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.status(200).json({
      message: "Orders fetched successfully",
      data: orders
    });
  };

  //my order details
  async getOrderById(req: OrderRequest, res: Response) {
    const { id } = req.params;

    const order = await Order.findOne({
      where: { id },
      attributes: ["id", "totalAmount", "createdAt"],
      include: [
        {
          model: Payment,
          as: "payment",
          attributes: ["paymentStatus"]
        },
        {
          model: OrderDetails,
          as: "orderDetails",
          attributes: ["orderQuantity"],
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["productName", "productImage", "productPrice"]
            }
          ]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order fetched successfully",
      data: order
    });
  }

}

export default new OrderController();
