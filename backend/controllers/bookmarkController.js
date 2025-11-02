import { Bookmarks } from "../models/Bookmarks.js";
import Forum from "../models/Forum.js";
import { Home } from "../models/Home.js";
import { Jobs } from "../models/Jobs.js";

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

            

           const promises = result.rows.map(async (row) => {
                let fetchedData = null;
                try{
                    switch (row.bookmarkable_type){
                        case 'post':
                            fetchedData = await Home.findById(row.bookmarkable_id, userId);
                            break;
                        case 'job':
                            fetchedData = await Jobs.findById(row.bookmarkable_id, userId);
                            break;
                        case 'forum':
                            fetchedData = await Forum.findById(row.bookmarkable_id, userId)
                            break;
                        default:
                            fetchedData = null;
                    }

                    return {
                        ...row,
                        data: fetchedData
                    };
                } catch (err) {
                    console.error(`Error fetching ${row.bookmarkable_type}:`, err);
                    return { ...row, data: null };
                }

           });

           const bookmarks = await Promise.all(promises);

           const hasMore = bookmarks.length === 10

           res.json({
                bookmarks: bookmarks,
                success: true,
                hasMore: hasMore
           });

        } catch (error) {
            console.error(`Error getting bookmarks: `, error);
            throw new Error(`Error getting bookmarks: ${error.message}`)
        }
    }

    static async addBookmark(req, res){ 
        try {
            const {id, type} = req.body
            const { userId, user } = req.session;

            if (!user) {
                return res.status(401).json({ success: false, message: 'Authentication required.' });
            }

            const result = await Bookmarks.addBookmark(id, type, userId);

            if(!result){
                return res.status(404).json({success: false, message: `Error adding bookmark.`});
            }

            res.json({
                success: true,
                message: `Bookmark added successfully.`,
                bookmark: result
            });


        } catch (error) {
            console.error(`Error adding bookmark: `, error);
            return res.status(500).json({
                success: false,
                message: `Error adding bookmark: ${error.message}`
            });
        }
    }

    static async deleteBookmark(req, res){
        try {
            const {id, type} = req.body
            const { userId, user } = req.session;

            if (!user) {
                return res.status(401).json({ success: false, message: 'Authentication required.' });
            }

            const deleted = await Bookmarks.deleteBookmark(id, type, userId);

            if (!deleted) {
                return res.status(404).json({ success: false, message: 'Bookmark not found.' });
            }

            res.json({success: true, message: `Bookmark deleted successfully`})

        } catch (error) {
            console.error(`Error deleting bookmark: `, error);
            return res.status(500).json({
                success: false,
                message: `Error deleting bookmark: ${error.message}`
            });
        }
    }
}