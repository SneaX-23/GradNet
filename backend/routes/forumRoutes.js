import express from "express";
import ForumController from "../controllers/forumController.js";

const router = express.Router();

router.get('/get-forums', ForumController.getForums);
router.put('edit-forum/:forumId', ForumController.editForum);
router.delete('delete-forum/:forumId', ForumController.deleteForum)
export default router;