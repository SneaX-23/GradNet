import db from "../config/database.js"

export class User{
    static async findByUSN(usn) {
        try {
            const result = await db.query("SELECT * FROM users WHERE usn = $1", [usn]);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error finding user by USN: ${error.message}`);
        }
    }
    static async findPreVerifiedStudent(usn){
        try {
            const result = await db.query("SELECT * FROM pre_verified_students WHERE usn = $1", [usn]);
            return result.rows[0] || null;
        } catch (error) {
        throw new Error(`Error finding student: ${error.message}`);
        }
    }
    static async findPreVerifiedStudentByemail(email){
        try {
            const result = await db.query("SELECT * FROM pre_verified_students WHERE email = $1", [email]);
            return result.rows[0] || null;
        } catch (error) {
        throw new Error(`Error finding student: ${error.message}`);
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

    static async checkhandle(handle) {
        try {
            const result = await db.query("SELECT id FROM users WHERE handle = $1", [handle]);
        
            if (result.rowCount === 0) {
                return true; 
            }

            return false;

        } catch (error) {
            throw new Error(`Error finding handle ${error.message}`)
        }
    }
    static async createProfile(user){
        const { usn, name, email, role = 'current_student', handle } = user;
        try {
            const result = await db.query(
                "INSERT INTO users (usn, name, email, role, handle) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [usn, name, email, role, handle]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating user ${error.message}`)
        }
    }
}