import express from "express";
import "./database/connection";
import cors from "cors";
const app = express();

import authRoute from "./routes/user-route";

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use("/pahiran", authRoute);

export default app;
