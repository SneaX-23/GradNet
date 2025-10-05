import express from "express";
import { MessageController } from "../controllers/messageController.js";

const router = express.Router();

router.get("/conversations", MessageController.getConversations);

router.get("/conversations/:conversationId", MessageController.getMessagesForConversation);

export default router;