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

    static async updateJob(req, res) {
        try {
            const { jobId } = req.params;
            const jobData = req.body;
            const { userId, user } = req.session;

            if (!user) {
                return res.status(401).json({ success: false, message: 'Authentication required.' });
            }

            const job = await Jobs.findById(jobId);

            if (!job) {
                return res.status(404).json({ success: false, message: 'Job not found.' });
            }

            if (job.posted_by !== userId && user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'You are not authorized to update this job.' });
            }

            if (jobData.application_deadline === '') {
                jobData.application_deadline = null;
            }

            const updatedJob = await Jobs.updateJob(jobId, jobData);

            res.json({ success: true, message: 'Job updated successfully.', job: updatedJob });
        } catch (error) {
            console.error("Error updating job:", error);
            res.status(500).json({ success: false, message: "Server error while updating job." });
        }
    }

    static async deleteJob(req, res) {
        try {
            const { jobId } = req.params;
            const { userId, user } = req.session;

            if (!user) {
                return res.status(401).json({ success: false, message: 'Authentication required.' });
            }

            const job = await Jobs.findById(jobId);

            if (!job) {
                return res.status(404).json({ success: false, message: 'Job not found.' });
            }

            if (job.posted_by !== userId && user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'You are not authorized to delete this job.' });
            }

            await Jobs.deleteById(jobId);

            res.json({ success: true, message: 'Job deleted successfully.' });
        } catch (error) {
            console.error("Error deleting job:", error);
            res.status(500).json({ success: false, message: "Server error while deleting job." });
        }
    }
}