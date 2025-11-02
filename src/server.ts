//1st
import adminSeeder from "./admin-seeder";
import app from "./app";
import { seedDefaultCategories } from "./controllers/category-controller";
import { seedSubCategories } from "./controllers/sub-category-controller";

import { config } from "dotenv";
config();
import sequelize from "./database/connection";

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");

    await sequelize.sync({ alter: false });
    console.log("✅ Models synchronized!");

    adminSeeder()
    seedDefaultCategories()
    seedSubCategories()

    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};


startServer();

