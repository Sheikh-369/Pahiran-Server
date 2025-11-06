import express, { Router } from "express"
import asyncErrorHandler from "../services/async-error-handler"
import orderController from "../controllers/order-controller"
import upload from "../middleware/multer-upload"
import Middleware, { Role } from "../middleware/middleware"

const router:Router=express.Router()

router.route("/order").post(
    Middleware.isLoggedIn,
    Middleware.accessTo(Role.Customer),
    upload.single("qrScreenshot"),
    asyncErrorHandler(orderController.createOrder)
)

router.route("/my-orders").get(
    Middleware.isLoggedIn,
    Middleware.accessTo(Role.Customer),
    asyncErrorHandler(orderController.getMyOrders)
)

//order by id
router.route("/my-orders/:id").get(
    Middleware.isLoggedIn,
    Middleware.accessTo(Role.Customer),
    asyncErrorHandler(orderController.getOrderById)
)

//all orders for admin
router.route("/all-orders").get(
    Middleware.isLoggedIn,
    Middleware.accessTo(Role.Admin),
    asyncErrorHandler(orderController.getAllOrdersForAdmin)
)

// Admin can update order
router.route("/order/:orderId").patch(
    Middleware.isLoggedIn,
    Middleware.accessTo(Role.Admin),
    asyncErrorHandler(orderController.editOrder)  
)


export default router