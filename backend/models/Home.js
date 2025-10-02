import db from "../config/database.js";

export class Home {
    static async GetFeed(page = 1) {
        try {
            const limit = 10;
            const offset = (page - 1) * limit;
            const query = `
                SELECT 
                    e.id, 
                    e.title, 
                    e.description, 
                    e.created_at, 
                    u.name AS author_name,
                    u.handle,
                    u.profile_picture_url,
                    (
                        SELECT json_agg(json_build_object('file_url', ef.file_url, 'file_mime_type', ef.file_mime_type))
                        FROM event_files ef
                        WHERE ef.event_id = e.id
                    ) AS files
                FROM events e 
                INNER JOIN users u ON e.posted_by = u.id 
                WHERE e.is_active = true
                ORDER BY e.created_at DESC 
                LIMIT $1 OFFSET $2;
            `;
            const result = await db.query(query, [limit, offset]);
            result.rows.forEach(row => {
                if (row.files && row.files.length === 1 && row.files[0] === null) {
                    row.files = [];
                }
            });
            return result;
        } catch (error) {
            throw new Error(`Error getting feed from DB: ${error.message}`);
        }
    }

    static async createWithFiles(postData, fileData) {
        const client = await db.connect();
        try {
            await client.query('BEGIN');


            const eventQuery = `
                INSERT INTO events (title, description, posted_by, is_active)
                VALUES ($1, $2, $3, true)
                RETURNING *;
            `;
            const eventResult = await client.query(eventQuery, [postData.title, postData.description, postData.posted_by]);
            const newEvent = eventResult.rows[0];

            if (fileData && fileData.length > 0) {
                const eventId = newEvent.id;
                for (const file of fileData) {
                    const fileQuery = `
                        INSERT INTO event_files (event_id, file_url, file_mime_type)
                        VALUES ($1, $2, $3);
                    `;
                    await client.query(fileQuery, [eventId, file.url, file.mimeType]);
                }
            }

            await client.query('COMMIT'); 
            return newEvent;

        } catch (error) {
            await client.query('ROLLBACK'); 
            throw new Error(`Error creating post with files: ${error.message}`);
        } finally {
            client.release();
        }
    }
}