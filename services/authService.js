import { User } from "../models/User.js";
import { OTP } from "../models/OTP.js";
import { EmailService } from "./emailService.js";

export class AuthService {
    static async _generateAndSendOtp(user) {
        await OTP.cleanupExpired();
        
        const otpCode = OTP.generateOTP();
        console.log(otpCode);
        await OTP.create(user.email, otpCode, 'login');

        await EmailService.sendOTPEmail(user.email, otpCode);
        return { email: user.email, success: true };
    }
    static async initiateLogin(usn) {
        try {
            const user = await User.findByUSN(usn);
            if (!user) {
                throw new Error('User not found');
            }
            return this._generateAndSendOtp(user);
        } catch (error) {
            throw new Error(`Login initiation failed: ${error.message}`);
        }
    }
    static async initiateLoginAgain(email){
        try {
            const user = await User.findByEmail(email);
            if(!user){
                throw new Error("User not found.");
            }
            return this._generateAndSendOtp(user);
        } catch (error) {
            throw new Error(`Login inition failed: ${error.message}`);
        }
    }

    static async verifyOTP(email, inputOTP) {
        try {
            const otpRecord = await OTP.findValidOTP(email);
            
            if (!otpRecord) {
                throw new Error('No valid OTP found');
            }

            if (otpRecord.otp_code !== inputOTP) {
                throw new Error('Invalid OTP');
            }

            
            await OTP.markAsUsed(email);

            
            const user = await User.findByEmail(email);
            if (user) {
                await User.updateLastLogin(user.id);
            }

            return { user, success: true };
        } catch (error) {
            throw new Error(`OTP verification failed: ${error.message}`);
        }
    }
}