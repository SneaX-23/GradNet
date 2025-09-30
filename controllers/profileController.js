import { User } from "../models/User.js";

export class ProfileController{
    static async getProfile(req, res){
       try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }

        const user = await User.findByUserId(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        res.json({ user: user, success: true, message: "User profile retrieved successfully." });

        } catch (error) {
            console.error("Error getting user profile:", error);
            res.status(500).json({ success: false, message: 'Failed to to get profile.' });
        }
    }
    
}
