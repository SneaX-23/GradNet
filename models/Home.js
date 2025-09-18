import db from "../config/database.js";

export class Home{
    static async getFeed(){
        try {
            const result = await db.query("SELECT id, title,description,image_url,created_at FROM events WHERE is_active = true ORDER BY created_at DESC LIMIT 10")
            return result;
        } catch (error) {
            throw new Error(`Error getting events:${error.message}`)
        }
    }
}