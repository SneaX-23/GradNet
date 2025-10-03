import express from "express";
import { JobController } from "../controllers/jobController.js";

const router = express.Router();

router.get("/get-jobs", JobController.getJobs);
router.post("/create-job", JobController.createJob);
export default router;