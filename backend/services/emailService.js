// import sgMail from "../config/email.js";
import resend from "../config/email.js";

export class EmailService {
    static async sendOTPEmail(email, otpCode) {
        const msg = {
            to: email,
            from: process.env.RESEND_SENDER_EMAIL,
            subject: 'OTP for GradNet Login',
            text: `Your OTP is ${otpCode}. This code will expire in 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                    <h2 style="color:#333; margin-bottom: 10px;">GradNet Login Verification</h2>
                    <p>Hello,</p>
                    <p>Your OTP for login is:</p>
                    <div style="background-color: #f7f7f7; padding: 18px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 3px; border-radius: 6px; margin: 20px 0;">
                        ${otpCode}
                    </div>
                    <p>This code will expire in <strong>10 minutes</strong>.</p>
                    <p>If you didn’t request this, you may ignore the email.</p>
                </div>
            `,
        };

        try {
            const result = await resend.emails.send(msg)
            if (!result || !result.id) return false;
            console.log(`OTP email sent to ${email}`);
            return true;
        } catch (error) {
            console.error('Email sending error:', error);
            throw new Error('Failed to send OTP email');
        }
    }
}