import express from "express";
import { 
    createMentor, 
    updateMentorProfile, 
    browseMentorships, 
    createMentee, 
    handleApplication,
    getMentorDashboard,
    getStudentDashboard,
    moderateMentorship
} from "../controllers/mentorControllers.js";

const router = express.Router();

router.get("/browse", browseMentorships);

// Apply for a mentorship (Mentee side)
router.post("/apply/:mentorship_id", createMentee);

// View- My Applications (Mentee side)
router.get("/my-applications", getStudentDashboard);


// --- Mentor Routes ---
router.post("/profile", createMentor);
router.patch("/profile", updateMentorProfile);
router.get("/dashboard", getMentorDashboard);

router.patch("/application/:enrollment_id", handleApplication);


// --- Faculty/Admin Routes ---
router.patch("/moderate/:mentorship_id", moderateMentorship);

export default router;