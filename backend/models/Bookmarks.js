import db from "../config/database.js";

export class Bookmarks{
    static async getBookmarks(page = 1, userId){
        try {
            const limit = 10;
            const offset = (page - 1) * limit;
            const query =  `
                SELECT 
                    bookmarkable_type,
                    bookmarkable_id
                FROM bookmarks
                WHERE user_id = $1
                ORDER BY created_at DESC
                LIMIT $2 OFFSET $3;
            `;

            const result = await db.query(query, [userId, limit, offset]);

            return result;

        } catch (error) {
            throw new Error(`Error getting bookmarks: ${error.message}`)
        }
    }

    static async addBookmark(id, type, userId) {
        try {
            const query = `
            INSERT INTO bookmarks (
                user_id, bookmarkable_type, bookmarkable_id
            ) VALUES ($1, $2, $3)
            RETURNING *;
            `;
            const values = [userId, type, id];
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error adding new bookmark: ${error.message}`);
        }
        }

    static async deleteBookmark(id, type, userId) {
        try {
            const query = `
            DELETE FROM bookmarks 
            WHERE user_id = $1 AND bookmarkable_type = $2 AND bookmarkable_id = $3
            RETURNING *;
            `;
            const values = [userId, type, id];
            const result = await db.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error deleting bookmark: ${error.message}`);
        }
        }
}