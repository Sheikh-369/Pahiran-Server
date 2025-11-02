"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../database/models/user-model"));
var Role;
(function (Role) {
    Role["Admin"] = "admin";
    Role["Customer"] = "customer";
})(Role || (exports.Role = Role = {}));
class Middleware {
    static async isLoggedI(req, res, next) {
        const token = req.headers.authorization;
        if (!token) {
            res.status(400).json({
                message: "Please Provide Token!"
            });
            return;
        }
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, async (err, success) => {
            if (err) {
                res.status(400).json({
                    message: "Invalid Token!"
                });
                return;
            }
            const userData = await user_model_1.default.findByPk(success.id);
            if (!userData) {
                res.status(400).json({
                    message: "The user does not exist!"
                });
                return;
            }
            req.user = userData;
            next();
        });
    }
    static accessTo(...roles) {
        return (req, res, next) => {
            const userRole = req.user?.role;
            if (!roles.includes(userRole)) {
                res.status(403).json({
                    message: "Unauthorized Access!"
                });
                return;
            }
            next();
        };
    }
}
exports.default = Middleware;
