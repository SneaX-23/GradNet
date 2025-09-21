import { Home } from "../models/Home.js"
import { User } from "../models/User.js";
import sanitize from "sanitize-html";

export class HomeController {
    static async renderHome(req, res){
        // const result = await Home.getFeed();
        try {
            const result = await Home.getFeed();
            res.render("home.ejs", { events: result.rows, user: req.session.user, role: req.session.user.role});
        } catch (error) {
            console.error(error);
            res.status(500).send("Error loading the feed.");
        }
    }
    static async createPost(req, res){
        try{
            const {title, description} = req.body;
            const cleanTitle = sanitize(title, {
                    allowedTags: [], 
                    allowedAttributes: {}
            });
            const cleanDescription = sanitize(description,{
                allowedTags: [],
                allowedAttributes: {}
            });
            const imageUrl = null;
            const videoUrl = null;
            if(req.file){
             if (req.file.mimetype.startsWith('image/')) {
                    imageUrl = `/uploads/${req.file.filename}`;
                } else if (req.file.mimetype.startsWith('video/')) {
                    videoUrl = `/uploads/${req.file.filename}`;
                }
            }

            const userID = req.session.userId; 
            const result = await Home.storePosts(userID, cleanTitle, cleanDescription, imageUrl, videoUrl);
            res.status(201).json({ success: true, post: result });
        }catch(error){
            console.error("Error in createPost controller:", error);
            res.status(500).json({ success: false, message: "Failed to create post." });
    }
    }
    
    static async getProfile(req, res){
        const id = req.session.userId;
        try {
            const user = await User.findByUserId(id);
            res.render("profile.ejs", {user : user, sessionUser: req.session.user});
        } catch (error) {
            throw new Error(`Error getting user profile: ${error.message}`);
            res.status(500).render("error.ejs", { message: "Could not load profile." });
        }
    }
    
}