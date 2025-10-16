import db from "../config/database.js";

export default class Post {
    static async getPostsByTopicId(topicId, page = 1) {
        try {
            const limit = 20;
            const offset = (page - 1) * limit;
            const query = `
                SELECT
                    p.id,
                    p.content,
                    p.created_at,
                    p.is_edited,
                    p.like_count,
                    p.reply_count,
                    u.id AS author_id,
                    u.name AS author_name,
                    u.handle,
                    u.profile_picture_url
                FROM forum_posts p
                INNER JOIN users u ON p.author_id = u.id
                WHERE p.topic_id = $1
                ORDER BY p.created_at ASC
                LIMIT $2 OFFSET $3
            `;
            const result = await db.query(query, [topicId, limit, offset]);
            return result;
        } catch (error) {
            throw new Error(`Error getting posts: ${error.message}`);
        }
    }

    static async createPost(topicId, userId, content) {
        try {
            const query = `
                INSERT INTO forum_posts (topic_id, author_id, content)
                VALUES ($1, $2, $3)
                RETURNING *
            `;
            const result = await db.query(query, [topicId, userId, content]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating post: ${error.message}`);
        }
    }
}