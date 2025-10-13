import Forum from "../models/Forum.js";

export default class ForumController{
    static async getForums(req, res){
        try{
            const page = parseInt(req.query.page, 10) || 1;
            const result = await Forum.getAllForums(page);
            
            if(!result){
                return res.status(500).json({success: false, message: "Error getting forums"});
            }
            const hasMore = result.rows.length === 10;

            res.json({
                forums: result.rows,
                success: true,
                hasMore: hasMore
            });
        }catch(error){
            console.error("Error getting forums: ", error);
            res.status(500).json({success: false, message: `Server error while getting forums`});
        }
    }
    static async editForum(req, res){
        
    }

    static async deleteForum(req, res){
        
    }
}