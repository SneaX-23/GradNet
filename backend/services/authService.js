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
            const existingUser = await User.findByUSN(usn);
            if (existingUser) {
                await this._generateAndSendOtp(existingUser);
                return { 
                    status: 'LOGIN', 
                    email: existingUser.email 
                };
            }
            const preVerifiedStudent = await User.findPreVerifiedStudent(usn);
            if (preVerifiedStudent) {
                await this._generateAndSendOtp(preVerifiedStudent);
                return { 
                    status: 'SIGNUP_REQUIRED',
                    email: preVerifiedStudent.email 
                };
            }

            throw new Error('User not found. Please check your USN.');
        } catch (error) {
            throw new Error(`Login initiation failed: ${error.message}`);
        }
    }
    static async initiateLoginAgain(email){
        try {
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                await this._generateAndSendOtp(existingUser);
                return { 
                    status: 'LOGIN', 
                    email: existingUser.email,
                };
            }
            const preVerifiedStudent = await User.findPreVerifiedStudentByemail(email);
            if (preVerifiedStudent) {
                await this._generateAndSendOtp(preVerifiedStudent);
                return { 
                    status: 'SIGNUP_REQUIRED',
                    email: preVerifiedStudent.email,
                };
            }

            throw new Error('User with this email not found.');
        } catch (error) {
            throw new Error(`Login inition failed: ${error.message}`);
        }
    }

    static async verifyOTP(inputOTP, email) {
        try {
            const otpRecord = await OTP.findValidOTP(email);
            
            if (!otpRecord || otpRecord.otp_code !== inputOTP) {
                throw new Error('Invalid OTP');
            }

            await OTP.markAsUsed(email);
            const user = await User.findByEmail(email);
            
            if (user) {
                await User.updateLastLogin(user.id);
                return { user, status: 'LOGIN', success: true };
            } else {
                return { user: { email: email }, status: 'SIGNUP_REQUIRED', success: true };
            }
        } catch (error) {
            throw new Error(`OTP verification failed: ${error.message}`);
        }
    }
}