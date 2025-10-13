
import db from "../config/database.js";

export default class Forum{
    static async getAllForums(page = 1){
        try {
            const limit = 10;
            const offset = (page - 1) * limit;
            const query = `
                SELECT 
                    f.id,
                    f.name,
                    f.description,
                    f.color,
                    f.created_by,
                    f.created_at,
                    u.name AS author_name,
                    u.handle,
                    u.profile_picture_url
                FROM forum_categories f
                INNER JOIN users u ON f.created_by = u.id
                WHERE f.is_active = true 
                ORDER BY f.created_at DESC
                LIMIT $1 OFFSET $2
            `;
            const result = await db.query(query, [limit, offset]);

            return result;
        } catch (error) {
            throw new Error(`Error getting forums: ${error.message}`)
        }
    }
}