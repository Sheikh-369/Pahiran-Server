import express, { Router } from "express"
import asyncErrorHandler from "../services/async-error-handler"
import orderController from "../controllers/order-controller"

const router:Router=express.Router()

router.route("/order").post(asyncErrorHandler(orderController.createOrder))

export default router