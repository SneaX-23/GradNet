import db from "../config/database.js";

export default class Topic {
    static async getTopicsByForumId(forumId, page = 1) {
        try {
            const limit = 15;
            const offset = (page - 1) * limit;
            const query = `
                SELECT
                    t.id,
                    t.title,
                    t.created_at,
                    t.view_count,
                    t.is_pinned,
                    u.name AS author_name,
                    u.handle,
                    u.profile_picture_url,
                    (SELECT COUNT(*) FROM forum_posts p WHERE p.topic_id = t.id) as post_count
                FROM forum_topics t
                INNER JOIN users u ON t.created_by = u.id
                WHERE t.category_id = $1
                ORDER BY t.is_pinned DESC, t.updated_at DESC
                LIMIT $2 OFFSET $3
            `;
            const result = await db.query(query, [forumId, limit, offset]);
            return result;
        } catch (error) {
            throw new Error(`Error getting topics: ${error.message}`);
        }
    }

    static async createTopic(forumId, userId, title, description) {
        try {
            const query = `
                INSERT INTO forum_topics (category_id, created_by, title, description)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `;
            const result = await db.query(query, [forumId, userId, title, description]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating topic: ${error.message}`);
        }
    }
}