"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendMail = async (mailInformation) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD
        }
    });
    const mailFormatObject = {
        from: "Pahiran",
        to: mailInformation.to,
        subject: mailInformation.subject,
        html: mailInformation.html
    };
    try {
        await transporter.sendMail(mailFormatObject);
    }
    catch (error) {
        console.log(error);
    }
};
exports.default = sendMail;
