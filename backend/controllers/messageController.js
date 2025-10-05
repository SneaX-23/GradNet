import { Message } from '../models/Message.js';
import db from '../config/database.js';

export class MessageController {
    static async getConversations(req, res) {
        try {
            const userId = req.session.userId;
            const query = `
                SELECT 
                    c.id, 
                    c.updated_at,
                    (
                        SELECT json_build_object(
                            'id', u.id, 
                            'name', u.name, 
                            'handle', u.handle, 
                            'profile_picture_url', u.profile_picture_url
                        )
                        FROM users u
                        JOIN conversation_participants cp_other ON cp_other.user_id = u.id
                        WHERE cp_other.conversation_id = c.id AND cp_other.user_id != $1
                    ) AS other_participant
                FROM conversations c
                JOIN conversation_participants cp ON c.id = cp.conversation_id
                WHERE cp.user_id = $1
                ORDER BY c.updated_at DESC;
            `;
            const { rows } = await db.query(query, [userId]);
            res.json({ success: true, conversations: rows });
        } catch (error) {
            console.error("Error fetching conversations:", error);
            res.status(500).json({ success: false, message: 'Failed to fetch conversations.' });
        }
    }

    static async getMessagesForConversation(req, res) {
        try {
            const { conversationId } = req.params;
            const userId = req.session.userId;

            const participantCheck = await db.query(
                "SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2",
                [conversationId, userId]
            );

            if (participantCheck.rows.length === 0) {
                return res.status(403).json({ success: false, message: 'Not authorized to view these messages.' });
            }

            const query = `
                SELECT id, sender_id, content, created_at 
                FROM messages 
                WHERE conversation_id = $1 
                ORDER BY created_at ASC;
            `;
            const { rows } = await db.query(query, [conversationId]);
            res.json({ success: true, messages: rows });
        } catch (error) {
            console.error("Error fetching messages:", error);
            res.status(500).json({ success: false, message: 'Failed to fetch messages.' });
        }
    }
}