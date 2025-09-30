import sgMail from "../config/email.js";

export class EmailService {
    static async sendOTPEmail(email, otpCode) {
        const msg = {
            to: email,
            from: process.env.SENDER_EMAIL,
            subject: 'OTP for GradNet Login',
            text: `Your OTP is ${otpCode}. This code will expire in 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>GradNet Login Verification</h2>
                    <p>Your OTP for login is:</p>
                    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
                        ${otpCode}
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this code, please ignore this email.</p>
                </div>
            `,
        };

        try {
            await sgMail.send(msg);
            console.log(`OTP email sent to ${email}`);
            return true;
        } catch (error) {
            console.error('Email sending error:', error);
            throw new Error('Failed to send OTP email');
        }
    }
}