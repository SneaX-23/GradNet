import { User } from "../models/User.js";

export class ProfileController{
    static async getProfile(req, res){
        try {
            const id = req.session.userId;
            const user = await User.findByUserId(id);
            res.render("profile.ejs", {user : user, sessionUser: req.session.user});
        } catch (error) {
            console.error(`Error getting user profile: ${error.message}`);
            res.status(500).render("error.ejs", {message: "Could not load profile." });
        }
    }
    
    static async editProfile(req, res){
        try {
            const id = req.session.userId;
            const updateUser = {};
            
            if (req.body.name && req.body.name.trim()) {
                updateUser.name = req.body.name.trim();
            }
            if (req.body.bio !== undefined) { 
                updateUser.bio = req.body.bio.trim();
            }
            if (req.body.department && req.body.department.trim()) {
                updateUser.department = req.body.department.trim();
            }
            if (req.body.phone && req.body.phone.trim()) {
                updateUser.phone = req.body.phone.trim();
            }
            if (req.body.linkedin_url && req.body.linkedin_url.trim()) {
                updateUser.linkedin_url = req.body.linkedin_url.trim();
            }

            if (req.files) {
                if (req.files.profileImage && req.files.profileImage[0]) {
                    updateUser.profile_picture_url = `/uploads/${req.files.profileImage[0].filename}`;
                }
                if (req.files.headerImage && req.files.headerImage[0]) {
                    updateUser.banner_image_url = `/uploads/${req.files.headerImage[0].filename}`;
                }
            }

            // console.log('Update data:', updateUser);
            // console.log('Files:', req.files);

            if (Object.keys(updateUser).length > 0) {
                await User.updateprofile(id, updateUser);

                req.session.user = { ...req.session.user, ...updateUser };
            }
            
            res.redirect("/profile");
            
        } catch (error) {
            console.error(`Error updating profile: ${error.message}`);
            res.status(500).render("error.ejs", {message: "Could not update profile." });
        }
    }
};