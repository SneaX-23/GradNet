import Forum from "../models/Forum.js";
import Topic from "../models/Topic.js";
import Post from "../models/Post.js";

export default class ForumController {
    // Get all forum categories
    static async getForums(req, res) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const result = await Forum.getAllForums(page);
            if (!result) {
                return res.status(500).json({ success: false, message: "Error getting forums" });
            }
            const hasMore = result.rows.length === 10;
            res.json({
                forums: result.rows,
                success: true,
                hasMore: hasMore
            });
        } catch (error) {
            console.error("Error getting forums: ", error);
            res.status(500).json({ success: false, message: 'Server error while getting forums' });
        }
    }

    // Get all topics for a specific forum
    static async getTopics(req, res) {
        try {
            const { forumId } = req.params;
            const page = parseInt(req.query.page, 10) || 1;
            const result = await Topic.getTopicsByForumId(forumId, page);
            const hasMore = result.rows.length === 15;
            res.json({
                topics: result.rows,
                success: true,
                hasMore: hasMore
            });
        } catch (error) {
            console.error("Error getting topics: ", error);
            res.status(500).json({ success: false, message: 'Server error while getting topics' });
        }
    }

    // Get all posts for a specific topic
    static async getPosts(req, res) {
        try {
            const { topicId } = req.params;
            const page = parseInt(req.query.page, 10) || 1;
            const result = await Post.getPostsByTopicId(topicId, page);
            const hasMore = result.rows.length === 20;
            res.json({
                posts: result.rows,
                success: true,
                hasMore: hasMore
            });
        } catch (error) {
            console.error("Error getting posts: ", error);
            res.status(500).json({ success: false, message: 'Server error while getting posts' });
        }
    }

    // Create a new topic
    static async createTopic(req, res) {
        try {
            const { forumId } = req.params;
            const { title, description } = req.body;
            const userId = req.session.userId;
            const newTopic = await Topic.createTopic(forumId, userId, title, description);

            const io = req.app.get('io');
            io.emit(`forum:${forumId}:new_topic`, newTopic);

            res.status(201).json({ success: true, topic: newTopic });
        } catch (error) {
            console.error("Error creating topic: ", error);
            res.status(500).json({ success: false, message: 'Failed to create topic' });
        }
    }

    // Create a new post in a topic
    static async createPost(req, res) {
        try {
            const { topicId } = req.params;
            const { content } = req.body;
            const userId = req.session.userId;
            const newPost = await Post.createPost(topicId, userId, content);

            const io = req.app.get('io');
            io.emit(`topic:${topicId}:new_post`, newPost);
            
            res.status(201).json({ success: true, post: newPost });
        } catch (error) {
            console.error("Error creating post: ", error);
            res.status(500).json({ success: false, message: 'Failed to create post' });
        }
    }

    static async createForum(req, res) {
        try {
            const { role } = req.session.user;
            if (role !== 'admin' && role !== 'faculty') {
                return res.status(403).json({ success: false, message: 'You are not authorized to create a forum category.' });
            }

            const { name, description, color } = req.body;
            const userId = req.session.userId;
            
            if (!name) {
                return res.status(400).json({ success: false, message: 'Forum name is required.' });
            }

            const newForum = await Forum.create(name, description, color, userId);
            
            const io = req.app.get('io');
            io.emit('new_forum_category', newForum);

            res.status(201).json({ success: true, forum: newForum });
        } catch (error) {
            console.error("Error creating forum: ", error);
            res.status(500).json({ success: false, message: 'Failed to create forum category' });
        }
    }
}