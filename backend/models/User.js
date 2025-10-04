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
    static async findByHandle(handle) {
        try {
            const result = await db.query("SELECT * FROM users WHERE handle = $1", [handle]);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error finding user by handle: ${error.message}`);
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
    static async updateProfile(userId, profileData) {
        const { name, bio, linkedin_url, github_url, twitter_url, profile_picture_url, profile_banner_url } = profileData;
    
        const fields = [];
        const values = [];
        let queryIndex = 1;
    
        if (name !== undefined) { fields.push(`name = $${queryIndex++}`); values.push(name); }
        if (bio !== undefined) { fields.push(`bio = $${queryIndex++}`); values.push(bio); }
        if (linkedin_url !== undefined) { fields.push(`linkedin_url = $${queryIndex++}`); values.push(linkedin_url); }
        if (github_url !== undefined) { fields.push(`github_url = $${queryIndex++}`); values.push(github_url); }
        if (twitter_url !== undefined) { fields.push(`twitter_url = $${queryIndex++}`); values.push(twitter_url); }
        if (profile_picture_url !== undefined) { fields.push(`profile_picture_url = $${queryIndex++}`); values.push(profile_picture_url); }
        if (profile_banner_url !== undefined) { fields.push(`profile_banner_url = $${queryIndex++}`); values.push(profile_banner_url); }
    
        if (fields.length === 0) {
            return this.findByUserId(userId); 
        }
    
        values.push(userId);
        const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${queryIndex} RETURNING *`;
    
        try {
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error updating user profile: ${error.message}`);
        }
    }

    static async GetUserPosts(page = 1, userId){
        try{
            const limit = 10;
            const offset = (page - 1) * limit;
            const query = `
                SELECT 
                    e.id,
                    e.title,
                    e.description,
                    e.created_at,
                    (
                        SELECT json_agg(json_build_object('file_url', ef.file_url, 'file_mime_type', ef.file_mime_type))
                        FROM event_files ef
                        WHERE ef.event_id = e.id
                    ) AS files
                FROM events e
                WHERE e.is_active = true AND e.posted_by = $1
                ORDER BY e.created_at DESC
                LIMIT $2 OFFSET $3
            `;
            const result = await db.query(query, [userId, limit, offset]);
            result.rows.forEach(row => {
                if (row.files && row.files.length === 1 && row.files[0] === null) {
                    row.files = [];
                }
            });
            return result;
        }catch(error){
            throw new Error(`Error getting users posts from DB: ${error.message}`);
        }
    }
}