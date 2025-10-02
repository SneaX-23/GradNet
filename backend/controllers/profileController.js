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
    static async updateProfile(req, res) {
        try {
            const userId = req.session.userId;
            const textData = req.body;
            const files = req.files;

            const profileDataToUpdate = { ...textData };

            if (files) {
                if (files.profileImage) {
                    profileDataToUpdate.profile_picture_url = `/uploads/${files.profileImage[0].filename}`;
                }
                if (files.bannerImage) {
                    profileDataToUpdate.profile_banner_url = `/uploads/${files.bannerImage[0].filename}`;
                }
            }

            const updatedUser = await User.updateProfile(userId, profileDataToUpdate);
            
            const { password, ...profileData } = updatedUser; 
            
            req.session.user = {
                ...req.session.user,
                name: profileData.name,
                profile_image_url: profileData.profile_picture_url
            };
            
            res.json({ success: true, message: "Profile updated successfully.", user: profileData });

        } catch (error) {
            console.error("Error updating user profile:", error);
            res.status(500).json({ success: false, message: 'Failed to update profile.' });
        }
    }
}
