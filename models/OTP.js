import db from "../config/database.js";

export class OTP {
    static async create(email, otpCode, purpose = 'login') {
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        try {
            await db.query("DELETE FROM otp_verifications WHERE email = $1", [email]);
            
            const result = await db.query(
                "INSERT INTO otp_verifications (email, otp_code, expires_at, purpose) VALUES ($1, $2, $3, $4) RETURNING *",
                [email, otpCode, expiresAt, purpose]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating OTP: ${error.message}`);
        }
    }

    static async findValidOTP(email) {
        try {
            const result = await db.query(
                "SELECT * FROM otp_verifications WHERE email = $1 AND expires_at > NOW() AND is_used = false ORDER BY created_at DESC LIMIT 1",
                [email]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error finding valid OTP: ${error.message}`);
        }
    }

    static async markAsUsed(email) {
        try {
            await db.query(
                "UPDATE otp_verifications SET is_used = true WHERE email = $1 AND is_used = false",
                [email]
            );
        } catch (error) {
            throw new Error(`Error marking OTP as used: ${error.message}`);
        }
    }

    static async cleanupExpired() {
        try {
            await db.query("DELETE FROM otp_verifications WHERE expires_at < NOW() OR is_used = true");
        } catch (error) {
            throw new Error(`Error cleaning up expired OTPs: ${error.message}`);
        }
    }

    static generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}