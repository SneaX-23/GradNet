import db from "../config/database.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../config/s3Service.js";


async function attachSignedUrls(files) {
    if (!files || files.length === 0) return [];

    return Promise.all(
        files.map(async (file) => {
            const signedUrl = await getSignedUrl(
                s3,
                new GetObjectCommand({
                    Bucket: process.env.AWS_S3_BUCKET,
                    Key: file.file_url
                }),
                { expiresIn: 60 }
            );
            return {
                ...file,
                url: signedUrl,
                file_url: signedUrl
            };
        })
    );
}

async function attachSignedUrlsToFeed(rows) {
    for (const row of rows) {
        if (!row.files || row.files[0] === null) {
            row.files = [];
            continue;
        }

        row.files = await Promise.all(
            row.files.map(async (file) => {
                const signedUrl = await getSignedUrl(
                    s3,
                    new GetObjectCommand({
                        Bucket: process.env.AWS_S3_BUCKET,
                        Key: file.file_url
                    }),
                    { expiresIn: 60 }
                );
                return {
                    ...file,
                    url: signedUrl,
                    file_url: signedUrl
                };
            })
        );
    }
}

export class Home {
    static async GetFeed(page = 1, userId) {
        try {
            const limit = 10;
            const offset = (page - 1) * limit;
            const query = `
                SELECT 
                    e.id, 
                    e.title, 
                    e.description, 
                    e.created_at,
                    e.posted_by, 
                    u.name AS author_name,
                    u.handle,
                    u.role,
                    u.position,
                    u.profile_picture_url,
                    (
                        SELECT json_agg(json_build_object('file_url', ef.file_url, 'file_mime_type', ef.file_mime_type))
                        FROM event_files ef
                        WHERE ef.event_id = e.id
                    ) AS files,

                    (CASE WHEN b.user_id IS NOT NULL THEN true ELSE false END) AS is_bookmarked

                FROM events e 
                INNER JOIN users u ON e.posted_by = u.id 
                
                
                LEFT JOIN public.bookmarks b 
                    ON b.bookmarkable_id = e.id 
                    AND b.user_id = $3 
                    AND b.bookmarkable_type = 'post' 
                
                WHERE e.is_active = true
                ORDER BY e.created_at DESC 
                LIMIT $1 OFFSET $2;
            `;
            const result = await db.query(query, [limit, offset, userId]);
            result.rows.forEach(row => {
                if (!row.files || row.files[0] === null) {
                    row.files = [];
                }
            });


            await attachSignedUrlsToFeed(result.rows);

            return result;
        } catch (error) {
            throw new Error(`Error getting feed from DB: ${error.message}`);
        }
    }

    static async findById(id, userId) {
        try {
            const query = `
                SELECT 
                    e.id, 
                    e.title, 
                    e.description, 
                    e.created_at,
                    e.posted_by, 
                    u.name AS author_name,
                    u.handle,
                    u.profile_picture_url,
                    (
                        SELECT json_agg(json_build_object('file_url', ef.file_url, 'file_mime_type', ef.file_mime_type))
                        FROM event_files ef
                        WHERE ef.event_id = e.id
                    ) AS files,

                    (CASE WHEN b.user_id IS NOT NULL THEN true ELSE false END) AS is_bookmarked

                FROM events e 
                INNER JOIN users u ON e.posted_by = u.id 
                
                
                LEFT JOIN public.bookmarks b 
                    ON b.bookmarkable_id = e.id 
                    AND b.user_id = $2 
                    AND b.bookmarkable_type = 'post' 
                
                WHERE e.is_active = true AND e.id = $1;
            `;
            const result = await db.query(query, [id, userId]);
            const post = result.rows[0];

            if (!post) return null;

            if (!post.files || post.files[0] === null) {
                post.files = [];
            }

            post.files = await attachSignedUrls(post.files);

            return post;
        } catch (error) {
            throw new Error(`Error finding post by ID: ${error.message}`);
        }
    }

    static async updateById(id, updateData) {
        try {
            const { title, description } = updateData;
            const query = `
                UPDATE events 
                SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP 
                WHERE id = $3 
                RETURNING *
            `;
            const result = await db.query(query, [title, description, id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error updating post by ID: ${error.message}`);
        }
    }

    static async deleteById(id) {
        try {
            const query = 'UPDATE events SET is_active = false WHERE id = $1 RETURNING id';
            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error deleting post by ID: ${error.message}`);
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
                    await client.query(fileQuery, [eventId, file.key, file.mimeType]);
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