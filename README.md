🎓 GradNet
Connecting AITM, Across Generations.

GradNet is a robust, web-based alumni networking platform designed to bridge the gap between current students, faculty, and alumni. Built with a distinct Retro Terminal (Black & White) aesthetic, it facilitates professional networking, mentorship, job sharing, and community discussions in real-time.

🚀 Features
🔐 Authentication & Onboarding
USN-based Login: Secure login using University Serial Numbers.

OTP Verification: Email-based One-Time Password authentication using SendGrid.

Pre-verified Student Database: Ensures only authorized alumni/students can register.

Profile Creation: Custom handle selection and profile setup upon first login.

📡 Social Feed & Interaction
Multimedia Posts: Users can create posts with text, images, videos, and PDF attachments.

Real-time Updates: New posts appear instantly via Socket.io.

Bookmarks: Save interesting posts, jobs, or forum topics for later.

💼 Job Portal
Job Board: Alumni and Faculty can post job openings and internships.

Detailed Listings: Includes salary range, job type, location, and application links.

Search & Filter: (Planned) Find relevant opportunities easily.

🗣️ Discussion Forums
Categorized Discussions: Organized forum categories (e.g., Tech, Career, General).

Threaded Topics: Create topics within categories for focused discussions.

Role-Based Access: Only Admins/Faculty can create new Forum Categories.

💬 Real-time Messaging
Private Chat: Instant messaging between users.

Inbox: View conversation history and start new chats via user search.

Socket.io Integration: Instant message delivery and status updates.

👥 Alumni Dashboard
Directory: Searchable database of alumni by Name or USN.

Rich Profiles: View graduation year, current company, bio, and social links (LinkedIn, GitHub, X).

🛠️ Tech Stack
Frontend
Framework: React (Vite)

UI Library: Material UI (MUI) with custom Retro styling

Routing: React Router DOM

Real-time: Socket.io Client

Utilities: React PDF, React Easy Crop, React Infinite Scroll Component

Backend
Runtime: Node.js

Framework: Express.js

Database: PostgreSQL (via pg pool)

Real-time: Socket.io

Authentication: Express Session, Custom Middleware

File Handling: Multer (Image/Document uploads)

Email Service: SendGrid

📂 Project Structure
Plaintext

GradNet/
├── backend/                # Express Server & API
│   ├── config/             # DB and Email configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth & Validation middleware
│   ├── models/             # SQL Query abstractions
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic (Auth, Email)
│   └── index.js            # Entry point
│
├── frontend/               # React Client
│   ├── src/
│   │   ├── assets/         # Images & Icons
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Global state (Auth)
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Main Application Pages
│   │   ├── services/       # API fetch wrappers
│   │   ├── styles/         # CSS (Retro theme)
│   │   └── App.jsx         # Main Component
│   └── vite.config.js      # Vite configuration
│
├── uploads/                # Server-side file storage
├── .gitignore
└── package.json            # Root script for concurrent execution
⚙️ Installation & Setup
Prerequisites
Node.js (v16+)

PostgreSQL

SendGrid API Key (for emails)

1. Clone the Repository
Bash

git clone https://github.com/yourusername/GradNet.git
cd GradNet
2. Database Setup
Create a PostgreSQL database named gradnet (or your preferred name).

Execute the SQL scripts (typically found in schema.sql or schema_v1.sql - not included in file list but referenced in gitignore) to create the necessary tables:

users, pre_verified_students, otp_verifications

events, event_files, bookmarks

job_posts, alumni_master_data

forum_categories, forum_topics, forum_posts

conversations, conversation_participants, messages

3. Backend Configuration
Navigate to the backend folder and install dependencies:

Bash

cd backend
npm install
Create a .env file in the backend/ directory:

Code snippet

PORT=3000
# Database Config
DB_USER=your_postgres_user
DB_HOST=localhost
DB_NAME=gradnet_db
DB_PASSWORD=your_postgres_password
DB_PORT=5432

# Session
SESSION_SECRET=your_super_secret_key

# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDER_EMAIL=your_verified_sender_email

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:5173
4. Frontend Configuration
Navigate to the frontend folder and install dependencies:

Bash

cd ../frontend
npm install
Create a .env file in the frontend/ directory:

Code snippet

VITE_API_BASE_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
🏃‍♂️ Running the App
You can run both the backend and frontend concurrently from the root directory:

Bash

# From the root project directory
npm install
npm run dev
Alternatively, run them strictly:

Backend:

Bash

cd backend
npm run dev
Frontend:

Bash

cd frontend
npm run dev
Access the application at http://localhost:5173.

🎨 Design System
GradNet utilizes a custom Retro Theme:

Font: Courier New, Monospace.

Palette: Strict Black (#000000) & White (#ffffff).

Components: Sharp edges (no border-radius), high contrast, pixelated assets.

🤝 Contributing
Fork the repository.

Create a feature branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'Add some AmazingFeature').

Push to the branch (git push origin feature/AmazingFeature).

Open a Pull Request.

📄 License
Distributed under the MIT License. See LICENSE for more information.