import { Bookmarks } from "../models/Bookmarks.js";

export class BookmarksController{
    static async getBookmarks(req, res){
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const { userId, user } = req.session;

            if (!user) {
                return res.status(401).json({ success: false, message: 'Authentication required.' });
            }

            const result = await Bookmarks.getBookmarks(page, userId);

            if(!result){
                return res.status(500).json({success: false, message: `Error getting bookmarks.`})
            }

            const hasMore = result.rows.length === 10

            res.json({
                bookmarks: result.rows,
                success: true,
                hasMore: hasMore
            });

        } catch (error) {
            console.error(`Error getting bookmarks: `, error);
            throw new Error(`Error getting bookmarks: ${error.message}`)
        }
    }
}