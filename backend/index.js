import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";

import db from "./config/database.js";

import "./config/passport.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import forumRoutes from "./routes/forumRoutes.js";
import alumniRoutes from "./routes/alumniRoutes.js";
import bookmarkRoutes from "./routes/bookmarksRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";

import { requireAuth } from "./middleware/authMiddleware.js";
import { Message } from "./models/Message.js";

import connectPgSimple from 'connect-pg-simple';
const PgSession = connectPgSimple(session);

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map(url => url.trim().replace(/\/$/, ""));

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.trim().replace(/\/$/, ""); 

    const isExplicitlyAllowed = allowedOrigins.includes(cleanOrigin);
    const isVercelPreview = cleanOrigin.endsWith('.vercel.app'); 

    if (isExplicitlyAllowed || isVercelPreview) {
      callback(null, true);
    } else {
      console.error(`CORS rejected origin: ${cleanOrigin}`);
      callback(null, false); 
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const isProduction = process.env.NODE_ENV === "production";

const sessionMiddleware = session({
  store: new PgSession({
    pool: db,
    tableName: 'user_sessions',
    createTableIfMissing: true
  }),
  name: "gradnet.sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
});

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("dist"));
app.use(express.static("public"));

const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


const io = new Server(httpServer, {
  cors: corsOptions,
});

app.set("io", io);

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

io.on("connection", (socket) => {
  const userId = socket.request.session?.userId;
  if (userId) {
    socket.join(userId.toString());
  }

  socket.on("private_message", async ({ content, to }) => {
    const senderId = socket.request.session?.userId;
    if (!senderId) return;

    try {
      const message = await Message.create({
        content,
        from: senderId,
        to,
      });

      io.to(to.toString()).emit("private_message", {
        content: message.content,
        from: senderId,
        createdAt: message.created_at,
      });

      io.to(to.toString()).emit("conversation_updated");
      io.to(senderId.toString()).emit("conversation_updated");
    } catch (err) {
      console.error("Socket message error:", err);
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
app.use("/api/mentor", mentorRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
