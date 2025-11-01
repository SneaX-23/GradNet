import express from "express";
import { AlumniController } from "../controllers/alumniController.js";

const router = express.Router();

router.get("/", AlumniController.getAlumniList);
router.get("/search", AlumniController.getAlumni);

export default router;