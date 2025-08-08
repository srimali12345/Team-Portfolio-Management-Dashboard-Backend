import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import AuthLoginRoutes from "./routes/authLoginRoutes.js";
import AuthRegisterRoutes from './routes/authRegisterRoutes.js'
       

import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

connectDB().then(() => {
  app.listen(8080, () => {
    console.log("Server is running on port 8080");
  });
});

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
    optionSuccessStatus: 200,
  })
);

app.use("/api", AuthLoginRoutes);
app.use("/api",AuthRegisterRoutes )
