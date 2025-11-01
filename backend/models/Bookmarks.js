import db from "../config/database.js";

export class Bookmarks{
    static async getBookmarks(page = 1, userId){
        try {
            const limit = 10;
            const offset = (page - 1) * limit;


        } catch (error) {
            throw new Error(`Error getting bookmarks: ${error.message}`)
        }
    }
}