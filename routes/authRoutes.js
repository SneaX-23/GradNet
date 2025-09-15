import express from "express";
import { AuthController } from "../controllers/authController.js";
import { requireAuth, requireGuest } from "../middleware/authMiddleware.js";

const router = express.Router();

// Guest routes
router.get("/", requireGuest, AuthController.renderLogin);
router.post("/submit-auth-info", requireGuest, AuthController.initiateAuth);
router.post("/otp-auth", requireGuest, AuthController.verifyOTP);

// Authenticated routes
router.get("/home", requireAuth, AuthController.renderHome);
router.post("/logout", requireAuth, AuthController.logout);

export default router;