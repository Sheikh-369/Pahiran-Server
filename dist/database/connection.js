"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = require("dotenv");
const user_model_1 = __importDefault(require("./models/user-model"));
const category_model_1 = __importDefault(require("./models/category-model"));
const sub_category_model_1 = __importDefault(require("./models/sub-category-model"));
const product_model_1 = __importDefault(require("./models/product-model"));
(0, dotenv_1.config)();
const connectionString = process.env.CONNECTION_STRING;
if (!connectionString) {
    throw new Error("Missing CONNECTION_STRING in .env");
}
const sequelize = new sequelize_typescript_1.Sequelize(connectionString, {
    dialect: "postgres",
    models: [user_model_1.default, category_model_1.default, sub_category_model_1.default, product_model_1.default], // loads all models from the models folder
    logging: false, // enable if you want SQL logs
});
// Authenticate and sync the database
try {
    sequelize
        .authenticate()
        .then(() => {
        console.log("Authentication Successful!");
    })
        .catch((err) => {
        console.error(`Unexpected Error occurred: ${err}`);
    });
}
catch (error) {
    console.log(error);
}
sequelize.sync({ force: false, alter: false }).then(() => {
    console.log("Migration Successful!");
});
exports.default = sequelize;
//2nd
// import { Sequelize } from "sequelize-typescript";
// import { config } from "dotenv";
// import User from "./models/user-model";
// import Category from "./models/category-model";
// import SubCategory from "./models/sub-category-model";
// import Product from "./models/product-model";
// config();
// const connectionString = process.env.CONNECTION_STRING as string;
// if (!connectionString) {
//   throw new Error("❌ Missing CONNECTION_STRING in .env");
// }
// const sequelize = new Sequelize(connectionString, {
//   dialect: "postgres",
//   models: [User, Category, SubCategory, Product],
//   logging: false,
//   // Supabase requires SSL
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false, // Supabase uses self-signed certs
//     },
//   },
//   // Connection pooling to prevent timeouts
//   pool: {
//     max: 10,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
// });
// // ✅ Test the connection
// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("✅ Database connected successfully!");
//     await sequelize.sync({ alter: false });
//     console.log("✅ Migration Successful!");
//   } catch (error:any) {
//     console.error("❌ Database connection failed:", error.message);
//   }
// })();
// export default sequelize;
//3rd
// import { Sequelize } from "sequelize-typescript";
// import { config } from "dotenv";
// config();
// const sequelize = new Sequelize(process.env.CONNECTON_STRING as string,{
//     models : [__dirname + '/models']
// });
// try {
//     sequelize.authenticate()
//   .then(() => {
//     console.log("Authentication Successful!");
//   })
//   .catch((err) => {
//     console.error(`Unexpected Error occurred: ${err}`);
//   });
// } catch (error) {
//     console.log(error)
// }
// sequelize.sync({force:false,alter:false}).then(()=>{
//     console.log("Migration Successful!")
// })
// export default sequelize;
