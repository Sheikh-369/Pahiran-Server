import express, { Router } from "express"
import Middleware, { Role } from "../middleware/middleware"
import asyncErrorHandler from "../services/async-error-handler"
import { addToCart, deleteCartItem, showCartItems, updateCartItemQuantity } from "../controllers/cart-controller"

const router:Router=express.Router()

router.route("/cart").post(
    Middleware.isLoggedIn,
    Middleware.accessTo(Role.Customer),
    asyncErrorHandler(addToCart)
)

router.route("/cart").get(
    Middleware.isLoggedIn,
    Middleware.accessTo(Role.Customer),
    asyncErrorHandler(showCartItems)
)

router.route("/cart/:cartItemId").delete(
    Middleware.isLoggedIn,
    Middleware.accessTo(Role.Customer),
    asyncErrorHandler(deleteCartItem)
)

router.route("/cart/:cartItemId").patch(
    Middleware.isLoggedIn,
    Middleware.accessTo(Role.Customer),
    asyncErrorHandler(updateCartItemQuantity)
)
export default router