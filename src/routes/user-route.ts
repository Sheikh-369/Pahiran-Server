import express, { Router } from "express";
import AuthController from "../controllers/auth-controller";
import Middleware, { Role } from "../middleware/middleware";
import upload from "../middleware/multer-upload";
import asyncErrorHandler from "../services/async-error-handler";

const router: Router = express.Router();

router.route("/register").post(asyncErrorHandler(AuthController.userRegister));

router.route("/login").post(asyncErrorHandler(AuthController.userLogin));

router.route("/forgot-password").post(asyncErrorHandler(AuthController.forgotPassword));

router.route("/reset-password").post(asyncErrorHandler(AuthController.resetPassword));

router.route("/customers").get(asyncErrorHandler(AuthController.fetchAllUsers));

//edit profile
router.route("/customer/:id").patch(
    Middleware.isLoggedIn,
    Middleware.accessTo(Role.Customer),
    upload.single("profileImage"),
    asyncErrorHandler(AuthController.updateProfile)
);

//fetch by Id
router.route("/customer/:id").get(
    Middleware.isLoggedIn,
    Middleware.accessTo(Role.Customer),
    asyncErrorHandler(AuthController.getUserById)
);

export default router;
