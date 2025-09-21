import session from "express-session";
import db from "../config/database.js";

export class Home{
    static async getFeed(){
        try {
            const result = await db.query("SELECT e.id, e.title, e.description, e.image_url,  e.created_at, u.name AS author_name FROM events e INNER JOIN users u ON e.posted_by = u.id WHERE e.is_active = true ORDER BY e.created_at DESC LIMIT 10;")
            return result;
        } catch (error) {
            throw new Error(`Error getting events:${error.message}`)
        }
    }
    static async storePosts(userID, title, description, imageUrl, videoUrl){
        const query = "INSERT INTO events (posted_by, title, description, image_url, video_url) VALUES ($1, $2, $3, $4, $5) RETURNING *";
        try{
        const result = await db.query(query, [userID, title, description, imageUrl, videoUrl])
        return result.rows[0];
        }catch(error){
            throw new Error(`Error storin the post: ${error}`);
        }
        
    }
}




// SELECT id, title,description,image_url,created_at FROM events WHERE is_active = true ORDER BY created_at DESC LIMIT 10