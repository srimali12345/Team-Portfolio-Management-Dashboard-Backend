import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import AuthRoutes from "./routes/UserRoutes/userRoutes.js";
import TeamRoutes from "./routes/TeamRoutes/teamRoutes.js";
import ProjectRoutes from "./routes/ProjectRoutes/projectsRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

connectDB().then(() => {
  app.listen(8080, () => {
    console.log("Server is running on port 8080");
  });
});

app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
    optionSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", AuthRoutes);
app.use("/api/team", TeamRoutes);
app.use("/api/projects", ProjectRoutes);
