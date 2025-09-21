import db from "../config/database.js";

export class User {
    static async findByUSN(usn) {
        try {
            const result = await db.query("SELECT * FROM users WHERE usn = $1", [usn]);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error finding user by USN: ${error.message}`);
        }
    }

    static async findByEmail(email) {
        try {
            const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error finding user by email: ${error.message}`);
        }
    }

    static async findByUserId(userId){
        try {
            const result = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error finding user by id: ${error.message}`)
        }
    }

    static async create(userData) {
        const { usn, name, email, password_hash, role = 'current_student' } = userData;
        try {
            const result = await db.query(
                "INSERT INTO users (usn, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [usn, name, email, password_hash, role]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    static async updateLastLogin(userId) {
        try {
            await db.query(
                "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1",
                [userId]
            );
        } catch (error) {
            throw new Error(`Error updating last login: ${error.message}`);
        }
    }
}