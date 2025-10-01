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
} 