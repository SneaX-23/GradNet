import express from "express";
import { UserController } from "../controllers/userController.js";
import { GitHubController } from "../controllers/githubController.js";

const router = express.Router();

router.get("/search", UserController.searchUsers);
router.get("/:handle/github-stats", GitHubController.getStats);

export default router;