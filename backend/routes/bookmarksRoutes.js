import express from "express";
import { BookmarksController } from "../controllers/bookmarkController";

const router = express.Router();

router.get("/", BookmarksController.getBookmarks)

export default router;