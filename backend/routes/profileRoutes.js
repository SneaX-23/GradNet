import express from "express";
import multer from "multer";
import { ProfileController } from "../controllers/profileController.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        if ((file.mimetype.startsWith('image/')) || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image and video files are allowed'));
        }
    }
});
router.get("/", ProfileController.getProfile)

// router.post("/update", upload.fields([
//         { name: 'profileImage', maxCount: 1 },
//         { name: 'headerImage', maxCount: 1 }
//     ]) ,ProfileController.editProfile);

export default router;
