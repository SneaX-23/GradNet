import express from "express";
import { AuthController } from "../controllers/authController.js";
import { requireAuth, requireGuest,requireOnboarding } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/submit-auth-info", requireGuest, AuthController.initiateAuth);
router.post("/otp-auth", requireGuest, AuthController.verifyOtp);
router.post("/resend-otp", requireGuest, AuthController.resendOtp);
router.get("/onboard", requireOnboarding, AuthController.getOnboardingDetails);
router.post("/check-handle", requireOnboarding, AuthController.checkHandle)
router.post("/create-profile", requireOnboarding, AuthController.createProfile)
// router.post("/logout", requireAuth, AuthController.logout);

export default router;