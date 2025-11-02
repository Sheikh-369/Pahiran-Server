import express from "express";
import cors from "cors";
const app = express();

import authRoute from "./routes/user-route";
import categoryRoute from "./routes/category-route"
import subCategoryRoute from "./routes/sub-category-route"
import productRoute from "./routes/product-route"
// import googleAuthRoute from "./routes/google-auth-route"; 
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);
//auth
app.use("/washtra", authRoute);
//category
app.use("/washtra",categoryRoute)
//sub-category
app.use("/washtra",subCategoryRoute)
//product
app.use("/washtra",productRoute)
//google oauth
// app.use("/washtra", googleAuthRoute);

export default app;