import { User } from '../models/User.js';

export class UserController {
    static async searchUsers(req, res) {
        try {
            const { q } = req.query;
            const currentUserId = req.session.userId;

            if (!q || q.trim() === '') {
                return res.json({ success: true, users: [] });
            }

            const users = await User.search(q, currentUserId);
            res.json({ success: true, users });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to search for users.' });
        }
    }
}