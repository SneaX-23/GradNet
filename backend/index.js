import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv"
import cors from 'cors';
import { Server } from "socket.io";

import { requireAuth } from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import  profileRoutes from "./routes/profileRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import { Message } from "./models/Message.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import forumRoutes from "./routes/forumRoutes.js";
import alumniRoutes from "./routes/alumniRoutes.js";
import bookmarkRoutes from "./routes/bookmarksRoutes.js"

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3000;


const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"] 
};

const httpServer = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`http://localhost:${port}`);
})


const io = new Server(httpServer, {
    cors: corsOptions
});

app.set('io', io);


app.use(cors(corsOptions)); 

app.use(express.static('dist'));
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.set('trust proxy', 1);
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
});

app.use(sessionMiddleware);
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, () => {
    // console.log("--- Socket.IO Middleware Check ---");
    // console.log("Session object:", socket.request.session);
    
    next();
  });
});

io.on('connection', (socket) => {
    // console.log('A user connected with socket ID:', socket.id);

    const userId = socket.request.session.userId;

    if (userId) {
        console.log(`Authenticated user ${userId} connected.`);
        socket.join(userId.toString());
    }
    socket.on('private_message', async ({ content, to }) => { 
        const senderId = socket.request.session?.userId;
        if (!senderId) {
            console.error("Error: Unauthenticated user tried to send a message.");
            return;
        }

        try {
            const message = await Message.create({
                content,
                from: senderId,
                to: to, 
            });

            console.log(`Saved and sending message from ${senderId} to ${to}`);
            
            io.to(to.toString()).emit('private_message', {
                content: message.content,
                from: senderId,
                createdAt: message.created_at,
            });
            
            io.to(to.toString()).emit('conversation_updated');
            io.to(senderId.toString()).emit('conversation_updated');
        } catch (error) {
            console.error("Failed to save or send message:", error);
        }
    });
});


app.use("/api", authRoutes);

app.use(requireAuth);

app.use("/api/home", homeRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

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