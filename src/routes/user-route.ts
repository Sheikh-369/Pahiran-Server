import express, { Router } from "express";
import AuthController from "../controllers/auth-controller";

const router: Router = express.Router();

router.route("/register").post(AuthController.userRegister);
router.route("/login").post(AuthController.userLogin);
router.route("/forgot-password").post(AuthController.forgotPassword);
router.route("/reset-password").post(AuthController.resetPassword);

export default router;
