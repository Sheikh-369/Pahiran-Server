import express, { Request, Response, Router } from "express";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import User from "../database/models/user-model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const router: Router = express.Router();

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_CALLBACK_URL,
});

// Step 1: Redirect user to Google Login
router.get("/auth/google", (req: Request, res: Response) => {
  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: ["email", "profile"],
  });
  res.redirect(url);
});

// Step 2: Google redirects back here with ?code=...
router.get("/auth/google/callback", async (req: Request, res: Response) => {
  const code = req.query.code as string;

  try {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email || !payload?.name) {
      return res.redirect("/washtra/auth/failure");
    }

    // 1️⃣ Find or create user in DB
    let user = await User.findOne({ where: { userEmail: payload.email } });

    if (!user) {
      user = await User.create({
        userName: payload.name,
        userEmail: payload.email,
        userPassword: await bcrypt.hash(Math.random().toString(36), 10),
        userPhoneNumber: "", // optional
        role: "customer",    // default role
        userPicture: payload.picture || null,
      });
    }

    // 2️⃣ Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        userName: user.userName,
        userEmail: user.userEmail,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // 3️⃣ Send token to frontend
    res.redirect(`http://localhost:3000/login/success?token=${token}`);
    // or if API: res.json({ token });

  } catch (err) {
    console.error("Error verifying Google login:", err);
    res.redirect("/washtra/auth/failure");
  }
});

// Optional failure route
router.get("/auth/failure", (req: Request, res: Response) => {
  res.status(401).send("Google Login Failed ❌");
});

export default router;
