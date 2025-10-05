import db from "../config/database.js";

export class Message {
    static async findOrCreateConversation(userId1, userId2) {
        const client = await db.connect();
        try {
            const findQuery = `
                SELECT cp1.conversation_id
                FROM conversation_participants AS cp1
                JOIN conversation_participants AS cp2 ON cp1.conversation_id = cp2.conversation_id
                JOIN conversations c ON cp1.conversation_id = c.id
                WHERE cp1.user_id = $1 AND cp2.user_id = $2 AND c.is_group = false;
            `;
            const existingConvo = await client.query(findQuery, [userId1, userId2]);

            if (existingConvo.rows.length > 0) {
                return existingConvo.rows[0].conversation_id;
            }
            await client.query('BEGIN');

            const newConversationQuery = `
                INSERT INTO conversations (created_by, is_group) VALUES ($1, false) RETURNING id;
            `;
            const newConversationResult = await client.query(newConversationQuery, [userId1]);
            const conversationId = newConversationResult.rows[0].id;

            const addParticipantsQuery = `
                INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2), ($1, $3);
            `;
            await client.query(addParticipantsQuery, [conversationId, userId1, userId2]);

            await client.query('COMMIT');

            return conversationId;
        } catch (error) {
            await client.query('ROLLBACK');
            console.error("Error in findOrCreateConversation:", error);
            throw error;
        } finally {
            client.release();
        }
    }
    static async create({ content, from, to }) {
        try {
            const conversationId = await this.findOrCreateConversation(from, to);

            const result = await db.query(
                `INSERT INTO messages (conversation_id, sender_id, content) 
                 VALUES ($1, $2, $3) RETURNING *`,
                [conversationId, from, content]
            );
            await db.query(
                "UPDATE conversations SET updated_at = NOW() WHERE id = $1",
                [conversationId]
            );

            return result.rows[0];
        } catch (error) {
            console.error("Error creating message:", error);
            throw new Error(`Error creating message: ${error.message}`);
        }
    }
}