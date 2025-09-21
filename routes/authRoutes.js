import express from "express";
import { AuthController } from "../controllers/authController.js";
import { requireAuth, requireGuest } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/", requireGuest, AuthController.renderLogin);
router.post("/submit-auth-info", requireGuest, AuthController.initiateAuth);
router.post("/otp-auth", requireGuest, AuthController.verifyOTP);
router.post("/resend-otp", requireGuest, AuthController.resendOtp)


// router.get("/home", requireAuth, );
router.post("/logout", requireAuth, AuthController.logout);

export default router;