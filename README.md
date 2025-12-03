<div align="center">

# 🎓 **GradNet**
### **Connecting AITM, Across Generations**
A retro-styled alumni networking platform built for students, alumni, and faculty to connect, collaborate, and grow.

<br>

![License](https://img.shields.io/badge/License-MIT-green.svg)
![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql&logoColor=white)
![Socket.io](https://img.shields.io/badge/Real--time-Socket.io-black?logo=socket.io)

<br>

**Retro Terminal UI · Real-time Messaging · Job Sharing · Alumni Directory · Forums**

</div>

---

## 📌 **Overview**

GradNet is a full-stack web application designed to bring together current students, faculty, and alumni of AITM.  
It features real-time interactions, job sharing, rich alumni profiles, and private messaging — all wrapped in a retro black-and-white terminal theme.

---

## 📚 **Table of Contents**

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the App](#-running-the-app)
- [Design System](#-design-system)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 **Features**

### 🔐 **Authentication & Onboarding**
- USN-based login  
- Email OTP verification (SendGrid)  
- Pre-verified student/alumni database  
- First-time profile setup (custom handle)

### 📰 **Social Feed**
- Create posts (text, images, video, PDFs)  
- Real-time updates via Socket.io  
- Bookmark system for posts and jobs  

### 💼 **Job Portal**
- Post job openings or internships  
- Detailed listings: salary, role type, location  
- Search & filtering (coming soon)

### 💬 **Real-time Messaging**
- Private 1:1 chat  
- Instant delivery & read updates  
- Search users and start conversations

### 🧵 **Discussion Forums**
- Forum categories (Tech, Career, General, etc.)  
- Threaded discussions  
- Admin/Faculty can create new categories    

---

## 🧰 **Tech Stack**

### **Frontend**
- React (Vite)
- Material UI (custom retro theme)
- React Router DOM
- Socket.io Client
- React PDF, React Easy Crop, Infinite Scroll

### **Backend**
- Node.js + Express  
- PostgreSQL (pg pool)  
- Socket.io  
- Express Session  
- Multer for uploads  
- SendGrid (OTP email)

---

## 📁 **Project Structure**

GradNet/
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── services/
│ └── index.js
│
├── frontend/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── context/
│ │ ├── hooks/
│ │ ├── pages/
│ │ ├── services/
│ │ └── App.jsx
│ └── vite.config.js
│
├── uploads/
└── package.json




## 🛠️ **Installation**

### **1. Clone the Repository**
```bash
git clone https://github.com/SneaX-23/GradNet.git
cd GradNet
⚙️ Environment Variables
Backend (backend/.env)
ini
Copy code
PORT=3000
DB_USER=your_user
DB_HOST=localhost
DB_NAME=gradnet_db
DB_PASSWORD=your_password
DB_PORT=5432

SESSION_SECRET=your_secret_key

SENDGRID_API_KEY=your_key
SENDER_EMAIL=your_verified_sender

FRONTEND_URL=http://localhost:5173
Frontend (frontend/.env)
ini
Copy code
VITE_API_BASE_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
▶️ Running the App
Start Backend
bash
Copy code
cd backend
npm install
npm run dev
Start Frontend
bash
Copy code
cd frontend
npm install
npm run dev
Access at → http://localhost:5173

🎨 Design System
GradNet embraces a strict retro terminal vibe:

Font: Courier New / monospace

Colors: Pure black #000 + white #fff

Zero border-radius (sharp, old-school window style)

Pixel-inspired UI elements

🤝 Contributing
Fork the repo

Create a feature branch

bash
Copy code
git checkout -b feature/myFeature
Commit your changes

Push to your fork

Open a Pull Request

📄 License
GradNet is released under the MIT License.
```
<div align="center">
✨ Happy Coding!.
</div> 
