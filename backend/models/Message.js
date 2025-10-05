import db from "../config/database.js";

export class Message {
    static async findOrCreateConversation(userId1, userId2) {
        const participants = [userId1, userId2].sort((a, b) => a - b);

        let conversation = await db.query(
            "SELECT id FROM conversations WHERE participant_ids = $1",
            [participants]
        );

        if (conversation.rows.length > 0) {
            return conversation.rows[0].id;
        } else {
            const newConversation = await db.query(
                "INSERT INTO conversations (participant_ids) VALUES ($1) RETURNING id",
                [participants]
            );
            return newConversation.rows[0].id;
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