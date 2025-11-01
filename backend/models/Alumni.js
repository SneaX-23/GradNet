import db from "../config/database.js";

export class Alumni{
    static async getAlumniList(page = 1){
        try {
                const limit = 30;
                const offset = (page - 1) * limit;
                const query = `
                    SELECT * FROM alumni_master_data ORDER BY graduation_year DESC
                    LIMIT $1 OFFSET $2
                `;
                const result = await db.query(query, [limit, offset])
                return result;

        } catch (error) {
            console.error("Error getting alumni data for dashboard:", error);
            throw new Error(`Error getting alumni data for dashboard: ${error.message}`);
        }
    }

    static async search(query) {
        try {
            const searchQuery = `
                SELECT name, usn, email, graduation_year, company_name, remarks
                FROM alumni_master_data 
                WHERE (name ILIKE $1 OR usn ILIKE $1) 
                LIMIT 10;
            `;
            const values = [`%${query}%`];
            const { rows } = await db.query(searchQuery, values);
            return rows;
        } catch (error) {
            console.error("Error searching for aluni:", error);
            throw new Error(`Error searching for alumni: ${error.message}`);
        }
    }
}