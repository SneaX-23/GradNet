import { Home } from "../models/Home.js"


export class HomeController{
    static async getFeed(req, res) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const result = await Home.GetFeed(page);

            if (!result) {
                return res.status(500).json({ success: false, message: "Error getting the feed" });
            }

            const hasMore = result.rows.length === 10;

            res.json({
                feed: result.rows,
                success: true,
                hasMore: hasMore
            });
        } catch (error) {
            console.error("Error in getFeed controller:", error);
            res.status(500).json({ success: false, message: "Server error while getting feed." });
        }
    }
    static async createPost(req, res) {
        try {
            const { title, description } = req.body;
            const userId = req.session.userId;
            const files = req.files;

            if (!title && !description) {
                return res.status(400).json({ success: false, message: "Post content is required." });
            }

            const postData = { title, description, posted_by: userId };
            const fileData = files ? files.map(file => ({
                url: `/uploads/${file.filename}`,
                mimeType: file.mimetype
            })) : [];

            const newPost = await Home.createWithFiles(postData, fileData);

            res.status(201).json({ success: true, message: "Post created successfully", post: newPost });

        } catch (error) {
            console.error("Error creating post:", error);
            res.status(500).json({ success: false, message: "Server error while creating post." });
        }
    }

    static async deletePost(req, res) {
        try {
            const { postId } = req.params;
            const { userId, user } = req.session;

            if (!user) {
                return res.status(401).json({ success: false, message: 'Authentication required.' });
            }

            const post = await Home.findById(postId);

            if (!post) {
                return res.status(404).json({ success: false, message: 'Post not found.' });
            }

            if (post.posted_by !== userId && user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'You are not authorized to delete this post.' });
            }

            await Home.deleteById(postId);

            res.json({ success: true, message: 'Post deleted successfully.' });
        } catch (error) {
            console.error("Error deleting post:", error);
            res.status(500).json({ success: false, message: "Server error while deleting post." });
        }
    }
}