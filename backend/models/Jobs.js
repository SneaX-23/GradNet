import db from "../config/database.js";

export class Jobs {
    static async getJobs(page = 1) {
        try {
            const limit = 15;
            const offset = (page - 1) * limit;
            const query = `
                SELECT 
                    j.id,
                    j.title,
                    j.company,
                    j.location,
                    j.job_type,
                    j.salary_range,
                    j.description,
                    j.requirements,
                    j.application_deadline,
                    j.external_link,
                    j.updated_at,
                    j.work_location,
                    u.name AS author_name,
                    u.handle,
                    u.profile_picture_url
                FROM job_posts j
                INNER JOIN users u ON j.posted_by = u.id
                WHERE j.is_active = true
                ORDER BY j.updated_at DESC
                LIMIT $1 OFFSET $2
            `;
            const result = await db.query(query, [limit, offset]);
            return result;
        } catch (error) {
            throw new Error(`Error getting jobs from DB: ${error.message}`);
        }
    }

    static async createJob(jobData) {
        const {
            posted_by,
            title,
            company,
            location,
            job_type,
            salary_range,
            description,
            requirements,
            application_deadline,
            external_link,
            work_location
        } = jobData;

        try {
            const query = `
                INSERT INTO job_posts (
                    posted_by, title, company, location, job_type, salary_range, 
                    description, requirements, application_deadline, external_link, work_location
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING *;
            `;
            const values = [
                posted_by, title, company, location, job_type, salary_range,
                description, requirements, application_deadline, external_link, work_location
            ];
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating job in DB: ${error.message}`);
        }
    }
}
