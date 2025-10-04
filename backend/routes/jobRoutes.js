import express from "express";
import { JobController } from "../controllers/jobController.js";

const router = express.Router();

router.get("/get-jobs", JobController.getJobs);
router.post("/create-job", JobController.createJob);
router.put("/update-job/:jobId", JobController.updateJob);
router.delete("/delete-job/:jobId", JobController.deleteJob);

export default router;