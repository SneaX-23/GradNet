import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv"
import cors from 'cors';

import { requireAuth } from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import  profileRoutes from "./routes/profileRoutes.js"
import homeRoutes from "./routes/homeRoutes.js"

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.static('dist'));
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: process.env.NODE_ENV === 'production'
    }
}));

app.use("/", authRoutes);

app.use(requireAuth);
app.use("/home", homeRoutes);
app.use("/profile", profileRoutes);

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false, 
        message: "Something went wrong!" 
    });
});


app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: "Page not found" 
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`http://localhost:${port}`);
});