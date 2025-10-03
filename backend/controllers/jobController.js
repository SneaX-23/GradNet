import { Jobs } from "../models/Jobs.js";

export class JobController {
    static async getJobs(req, res) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const result = await Jobs.getJobs(page);

            if (!result) {
                return res.status(500).json({ success: false, message: "Error getting jobs" });
            }

            const hasMore = result.rows.length === 15;

            res.json({
                jobs: result.rows,
                success: true,
                hasMore: hasMore
            });
        } catch (error) {
            console.error("Error in getJobs controller:", error);
            res.status(500).json({ success: false, message: "Server error while getting jobs." });
        }
    }

    static async createJob(req, res) {
        try {
            const jobData = { ...req.body, posted_by: req.session.userId };

            if (jobData.application_deadline === '') {
                jobData.application_deadline = null;
            }
            
            const newJob = await Jobs.createJob(jobData);

            res.status(201).json({ success: true, message: "Job created successfully", job: newJob });

        } catch (error) {
            console.error("Error creating job:", error);
            res.status(500).json({ success: false, message: "Server error while creating job." });
        }
    }
}
