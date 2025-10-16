import express from "express";
import ForumController from "../controllers/forumController.js";

const router = express.Router();


router.get('/get-forums', ForumController.getForums);
router.post('/create-forum', ForumController.createForum);

router.get('/:forumId/topics', ForumController.getTopics);
router.post('/:forumId/topics', ForumController.createTopic);

router.get('/topics/:topicId/posts', ForumController.getPosts);
router.post('/topics/:topicId/posts', ForumController.createPost);

export default router;