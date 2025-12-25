import { AuthService } from "../services/authService.js";
import { User } from "../models/User.js";
class UserNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserNotFoundError';
        }
}

export class AuthController{
    static async initiateAuth(req, res){
        try {
            const {usn} = req.body
            if(!usn){
                return res.status(400).json({success: false, message: "USN is required"});
            }
            const result = await AuthService.initiateLogin(usn);

            req.session.email = result.email;
            req.session.otpSent = true;

            res.json({
                status: result.status,
                email: result.email,
                message: "OTP has been sent to your email."
            });

        } catch (error) {
        console.error(error.message)
        console.error(error); 
        if (error instanceof UserNotFoundError) {
            return res.status(404).json({ success: false, message: "This USN is not registered." });
        }
        return res.status(500).json({ success: false, message: "An unexpected error occurred. Please try again." });
        }
        
    }
    static async resendOtp(req, res) {
        try {
        
            const email = req.session.email;
            if (!email) {
                return res.status(400).json({ success: false, message: 'Session expired or email not found.' });
            }
            const result = await AuthService.initiateLoginAgain(email);
            res.json({ status: result.status,success: true, message: 'New OTP sent successfully.' });

        } catch (error) {
            console.error('Error resending OTP:', error);
            res.status(500).json({ success: false, message: 'Failed to resend OTP.' });
        }
    }

static async verifyOtp(req, res) {
    try {
        const { otp } = req.body;
        const email = req.session.email;

        if (!email || !req.session.otpSent) {
            return res.status(400).json({ success: false, message: "Session expired. Please try again." });
        }

        if (!otp) {
            return res.status(400).json({ success: false, message: "Please enter the OTP." });
        }
        
        const result = await AuthService.verifyOTP(otp, email);
        
        if (result.status === 'LOGIN') {
            delete req.session.email;
            delete req.session.otpSent;
            // console.log("USER OBJECT FROM AUTHSERVICE:", result.user);
            req.session.userId = result.user.id;
            req.session.user = {
                id: result.user.id,
                name: result.user.name,
                email: result.user.email,
                role: result.user.role,
                handle: result.user.handle,
                profile_image_url: result.user.profile_picture_url
            };
            // console.log(req.session.user)

            return res.json({ success: true, status: 'LOGIN',user: req.session.user });

        } else if (result.status === 'SIGNUP_REQUIRED') {
            delete req.session.otpSent;
            
            return res.json({ success: true, status: 'SIGNUP_REQUIRED' });

        } else {
            throw new Error("Invalid status from AuthService");
        }

    } catch (error) {
        console.error("OTP Verification Error:", error.message);
        return res.status(400).json({ success: false, message: error.message || "Invalid OTP." });
    }
}

    static async getOnboardingDetails(req, res) {
        try {
            const email = req.session.email;

            if (!email) {
            return res.status(401).json({ success: false, message: 'Not authorized for onboarding.' });
            }

            const studentDetails = await User.findPreVerifiedStudentByemail(email);

            if (!studentDetails) {
                return res.status(404).json({ success: false, message: 'Pre-verified student details not found.' });
            }
        
            res.json({ user: studentDetails, success: true });

        } catch (error) {
            console.error("Error getting onboarding details:", error);
            res.status(500).json({ success: false, message: 'Failed to retrieve onboarding details.' });
        }
    }

    static async checkHandle(req, res){
        try{
            const{handle} = req.body;
            if(!handle){
                return res.status(401).json({ success: false, message: 'Please enter handle you wish to use.' });
            }
            const available = await User.checkhandle(handle);
            res.json({available: available, success: true});
        }catch(error){
            console.error("Error checking handle, ", error)
            res.status(500).json({success: false, message: 'Failed to check handle'})
        }
    }
    static async createProfile(req, res){
        try{
            const user = req.body;
            if (!user || !user.usn) {
            return res.status(400).json({ success: false, message: 'User data is missing.' });
            }
            const newUser = await User.createProfile(user);

            if (!newUser) {
                return res.status(500).json({ success: false, message: 'Error creating user.' });
            }

            req.session.userId = newUser.id;
            req.session.user = {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role || "current_student",
                profile_image_url: newUser.profile_picture_url || null,
                handle: newUser.handle,
            };
            delete req.session.email; 

            res.status(201).json({ success: true, message: 'User created successfully.', user: req.session.user });
        }catch(error){
            console.error("Error creating handle, ", error)
            res.status(500).json({success: false, message: 'Error creating user'})
        }
    }
    static async logout(req, res) {
        req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Could not log out, please try again.' });
        }
        res.clearCookie('gradnet.sid'); 
        res.json({ success: true, message: 'You have been logged out.' });
    });
    }
    static async checkSession(req, res) {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            return res.status(401).json({ success: false });
        }

        return res.json({
            success: true,
            user: req.session.user,
        });
    }
}