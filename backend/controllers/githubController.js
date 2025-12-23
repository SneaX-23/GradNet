import { User } from "../models/User.js";
import { GitHubService } from "../services/githubService.js";

export class GitHubController {
    static async getStats(req, res) {
        try {
            const { handle } = req.params;
            const user = await User.findByHandle(handle);

            if (!user || !user.github_url) {
                return res.status(404).json({ success: false, message: "No GitHub profile linked." });
            }

            // Extract username from URL
            const githubUsername = user.github_url.split('/').filter(Boolean).pop();
            const data = await GitHubService.getGitHubData(githubUsername);

            res.json({ success: true, githubUsername, data });
        } catch (error) {
            console.error("GitHub Controller Error:", error);
            res.status(500).json({ success: false, message: "Error fetching GitHub stats" });
        }
    }
}