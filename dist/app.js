"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./database/connection");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const user_route_1 = __importDefault(require("./routes/user-route"));
const category_route_1 = __importDefault(require("./routes/category-route"));
const sub_category_route_1 = __importDefault(require("./routes/sub-category-route"));
const product_route_1 = __importDefault(require("./routes/product-route"));
const google_auth_route_1 = __importDefault(require("./routes/google-auth-route"));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true
}));
//auth
app.use("/washtra", user_route_1.default);
//category
app.use("/washtra", category_route_1.default);
//sub-category
app.use("/washtra", sub_category_route_1.default);
//product
app.use("/washtra", product_route_1.default);
//google oauth
app.use("/washtra", google_auth_route_1.default);
exports.default = app;
