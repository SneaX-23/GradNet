import express from "express";
import { AuthController } from "../controllers/authController.js";
import { requireAuth, requireGuest,requireOnboarding } from "../middleware/authMiddleware.js";
import passport from 'passport';

const router = express.Router();


router.post("/submit-auth-info", requireGuest, AuthController.initiateAuth);
router.post("/otp-auth", requireGuest, AuthController.verifyOtp);
router.post("/resend-otp", requireGuest, AuthController.resendOtp);
router.get("/onboard", requireOnboarding, AuthController.getOnboardingDetails);
router.post("/check-handle", requireOnboarding, AuthController.checkHandle)
router.post("/create-profile", requireOnboarding, AuthController.createProfile)
router.post("/logout", requireAuth, AuthController.logout);
router.get("/session-status", requireAuth, AuthController.checkSession);


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
  (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        if (err) { 
            return next(err);
        }
        if (!user) {
            const message = info?.message || 'Login failed';
            return res.redirect(`${frontendUrl}/?error=${encodeURIComponent(message)}`);
        }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            
            req.session.userId = user.id; 
            req.session.user = {
            id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                handle: user.handle,
                profile_image_url: user.profile_picture_url
            };
            
            req.session.save((err) => {
                if (err) console.error("Session save error:", err);
                res.redirect(`${frontendUrl}/home`);
            });
        });
    })(req, res, next);
  }
);

export default router;