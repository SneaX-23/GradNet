import express from "express";
import { BookmarksController } from "../controllers/bookmarkController.js";

const router = express.Router();

router.get("/", BookmarksController.getBookmarks);
router.post("/", BookmarksController.addBookmark);
router.delete("/", BookmarksController.deleteBookmark);

export default router;
