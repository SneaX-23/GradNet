import db from "../config/database.js"
export class Home{
    static async GetFeed(page = 1) {
        try {
            const limit = 10;
            const offset = (page - 1) * limit;

            const query = `
                SELECT 
                    e.id, 
                    e.title, 
                    e.description, 
                    e.image_url,  
                    e.created_at, 
                    u.name AS author_name,
                    u.handle,
                    u.profile_picture_url 
                FROM events e 
                INNER JOIN users u ON e.posted_by = u.id 
                WHERE e.is_active = true 
                ORDER BY e.created_at DESC 
                LIMIT $1 OFFSET $2;
            `;
            const result = await db.query(query, [limit, offset]);
            return result;
        } catch (error) {
            throw new Error(`Error getting feed from DB: ${error.message}`);
        }
    }
} 