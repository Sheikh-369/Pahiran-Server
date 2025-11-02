"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const google_auth_library_1 = require("google-auth-library");
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = __importDefault(require("../database/models/user-model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const router = express_1.default.Router();
const client = new google_auth_library_1.OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_CALLBACK_URL,
});
// Step 1: Redirect user to Google Login
router.get("/auth/google", (req, res) => {
    const url = client.generateAuthUrl({
        access_type: "offline",
        scope: ["email", "profile"],
    });
    res.redirect(url);
});
// Step 2: Google redirects back here with ?code=...
router.get("/auth/google/callback", async (req, res) => {
    const code = req.query.code;
    try {
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload?.email || !payload?.name) {
            return res.redirect("/washtra/auth/failure");
        }
        // 1️⃣ Find or create user in DB
        let user = await user_model_1.default.findOne({ where: { userEmail: payload.email } });
        if (!user) {
            user = await user_model_1.default.create({
                userName: payload.name,
                userEmail: payload.email,
                userPassword: await bcrypt_1.default.hash(Math.random().toString(36), 10),
                userPhoneNumber: "", // optional
                role: "customer", // default role
                userPicture: payload.picture || null,
            });
        }
        // 2️⃣ Generate JWT
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            userName: user.userName,
            userEmail: user.userEmail,
            role: user.role,
        }, process.env.JWT_SECRET, { expiresIn: "7d" });
        // 3️⃣ Send token to frontend
        res.redirect(`http://localhost:3000/login/success?token=${token}`);
        // or if API: res.json({ token });
    }
    catch (err) {
        console.error("Error verifying Google login:", err);
        res.redirect("/washtra/auth/failure");
    }
});
// Optional failure route
router.get("/auth/failure", (req, res) => {
    res.status(401).send("Google Login Failed ❌");
});
exports.default = router;
