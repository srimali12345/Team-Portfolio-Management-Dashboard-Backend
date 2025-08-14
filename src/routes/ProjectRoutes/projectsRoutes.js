import express from "express";
import {
  addProject,
  getProjects,
  updateProject,
  deleteProject,
  activateProject,
  getMemberPortfolio,
} from "../../controllers/Projects/projectsController.js";

const router = express.Router();

router.post("/addProject", addProject);
router.get("/getProjects", getProjects);
router.put("/updateProject/:id", updateProject);
router.delete("/deleteProject/:id", deleteProject);
router.put("/activateProject/:projectId", activateProject);
router.get("/portfolio/:id", getMemberPortfolio);

export default router;
