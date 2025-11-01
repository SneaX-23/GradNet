import { Alumni } from "../models/Alumni.js";

export class AlumniController{
    static async getAlumniList(req, res){
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const result = await Alumni.getAlumniList(page);
            if(!result){
                return res.status(500).json({success: false, message: `Error getting the data`});
            }

            const hasMore = result.rows.length === 30;

            res.json({
                data: result.rows,
                success: true,
                hasMore
            })
        } catch (error) {
            console.error(`Error geting data:`, error);
            res.status(500).json({success: false, message: `Server Error while getting data.`})
        }
    }

    static async getAlumni(req, res){
        try {
            const {q} = req.query;

            if(!q || q.trim() === ''){
                return res.json({success: true, alumni: []})
            }

            const alumni = await Alumni.search(q);

            res.json({success: true, alumni})

        } catch (error) {
            console.error("Error in getAlumni controller:", error);

            res.status(500).json({succes: false, message: `Error searching for alumni.`})
        }
    }
}