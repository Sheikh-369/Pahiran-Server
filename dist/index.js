"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const category_controller_1 = require("./controllers/category-controller");
const sub_category_controller_1 = require("./controllers/sub-category-controller");
dotenv_1.default.config();
const PORT = process.env.PORT;
function startServer() {
    const PORT = process.env.PORT || 5000;
    app_1.default.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
        (0, category_controller_1.seedDefaultCategories)();
        (0, sub_category_controller_1.seedSubCategories)();
    });
}
startServer();
