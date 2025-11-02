import { Request, Response } from "express";
import User from "../database/models/user-model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOPT } from "../services/generateOTP";
import sendMail from "../services/sendMail";

class AuthController {
  static async userRegister(req: Request, res: Response) {
    //validation
    const {
      userName,
      userEmail,
      userPassword,
      confirmPassword,
      userPhoneNumber,
    } = req.body;
    if (
      !userName ||
      !userEmail ||
      !userPassword ||
      !confirmPassword ||
      !userPhoneNumber
    ) {
      res.status(400).json({
        message: "Please fill all the fields.",
      });
      return;
    }

    //checking if user exists already
    const existingUser = await User.findOne({ where: { userEmail } });
    if (existingUser) {
      res.status(400).json({
        message: "User already exists.",
      });
      return;
    }

    //confirming password
    if (userPassword !== confirmPassword) {
      res.status(400).json({
        message: "Password and Confirm password did not match.",
      });
      return;
    }

    await User.create({
      userName,
      userEmail,
      userPassword: await bcrypt.hash(userPassword, 10),
      userPhoneNumber,
    });

    res.status(200).json({
      message: "User Created Successfully.",
    });
  }

  static async userLogin(req: Request, res: Response) {
    const { userEmail, userPassword } = req.body;
    //validation
    if (!userEmail || !userPassword) {
      res.status(400).json({
        message: "Please provide Email and Password.",
      });
    }
    //checking user existence
    const existingUser = await User.findOne({ where: { userEmail } });

    if (!existingUser) {
      res.status(400).json({
        message: "Eamil not registered.",
      });
      return;
    }
    //checking password
    const isPasswordMatching = bcrypt.compareSync(
      userPassword,
      existingUser.userPassword
    );
    if (!isPasswordMatching) {
      res.status(400).json({
        message: "Invalid Email or Password.",
      });
      return;
    }

    const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login Successful.",
      token,
    });
  }

  static async forgotPassword(req: Request, res: Response) {
    const { userEmail } = req.body;
    //validation check
    if (!userEmail) {
      res.status(400).json({
        message: "Please provide Email.",
      });
      return;
    }
    //email check
    const existingUser = await User.findOne({ where: { userEmail } });
    if (!existingUser) {
      res.status(400).json({
        message: "Email not registered.",
      });
      return;
    }

    const OTP = sendOPT();
    sendMail({
      to: userEmail,
      subject: "Password Reset Request",
      html: `<div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background: #ffffff;">
            <h2 style="color: #333;">Password Reset OTP</h2>
            <p>Hello,</p>
            <p>Your One-Time Password (OTP) to reset your password is:</p>
            <div style="font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; color: #007bff;">${OTP}</div>
            <p>This code is valid for the next 10 minutes. Please do not share it with anyone.</p>
            <p>If you did not request this, you can safely ignore this email.</p>
            <p style="font-size: 12px; color: #777;">Thanks,<br>The Support Team</p>
        </div>`,
    });

    existingUser.OTP = OTP.toString();
    existingUser.OTPGeneratedTime = new Date(new Date().getTime());
    existingUser.OTPExpiry = new Date(new Date().getTime() + 600000);
    await existingUser.save();

    res.status(200).json({
      message: "If the email is registered, an OTP was sent to your Email.",
    });
  }

  static async resetPassword(req: Request, res: Response) {
    const { userEmail, OTP, newPassword, confirmNewPassword } = req.body;
    //validations
    if (!userEmail || !OTP || !newPassword || !confirmNewPassword) {
      res.status(400).json({
        message: "Please fill all the fields.",
      });
      return;
    }
    //existing user
    const existingUser = await User.findOne({ where: { userEmail } });
    if (!existingUser) {
      res.status(400).json({
        message: "Email not found.",
      });
      return;
    }
    // Check if OTP is expired
    if (
      !existingUser.OTP ||
      !existingUser.OTPExpiry ||
      new Date() > new Date(existingUser.OTPExpiry)
    ) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new one.",
      });
    }

    // OPTIONAL: If you hashed the OTP, use bcrypt.compareSync here instead
    if (existingUser.OTP !== OTP.toString()) {
      return res.status(400).json({
        message: "Invalid OTP.",
      });
    }

    // Hash the new password and save
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    existingUser.userPassword = hashedPassword;

    // Clear OTP fields
    existingUser.OTP = null;
    existingUser.OTPGeneratedTime = null;
    existingUser.OTPExpiry = null;

    await existingUser.save();

    return res.status(200).json({
      message: "Password has been reset successfully.",
    });
  }

  static async fetchAllUsers(req:Request,res:Response){
    const users=await User.findAll()
    res.status(200).json({
      message:"All users fetched successfully.",
      data:users
    })
  }
}

export default AuthController;
