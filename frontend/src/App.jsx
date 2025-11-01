import './styles/App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, Typography } from '@mui/material'; // Import Box and Typography for placeholders
import Login from './pages/LoginPage';
import VerifyOtp from './pages/VerifyOtpPage';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import CreateProfilePage from './pages/CreaeteProfilePage';
import ProfilePage from './pages/ProfilePage';
import JobsPage from './pages/JobsPage';
import UserProfilePage from './pages/UserProfilePage';
import MessagesPage from './pages/MessagesPage';
import ForumPage from './pages/ForumPage';
import TopicPage from './pages/TopicPage';
import PostPage from './pages/PostPage';

// --- Placeholder component ---
const PlaceholderPage = ({ title }) => (
  <Box sx={{ display: 'flex', bgcolor: '#000', color: '#fff', minHeight: '100vh', fontFamily: "'Courier New', Courier, monospace" }}>
    <Typography variant="h1" sx={{ m: 'auto', fontFamily: "'Courier New', Courier, monospace" }}>
      {title} Page
    </Typography>
  </Box>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Login />} />
          <Route path='/submit-auth-info' element={<VerifyOtp />} />
          <Route path="/create-profile" element={<CreateProfilePage />} />

          {/* Main App Routes */}
          <Route path='/home' element={<HomePage />}/>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:handle" element={<UserProfilePage />} />
          <Route path='/jobs' element={<JobsPage />}/>
          <Route path="/messages" element={<MessagesPage />} />
          
          {/* Forum Routes */}
          <Route path="/forums" element={<ForumPage />} />
          <Route path="/forums/:forumId" element={<TopicPage />} />
          <Route path="/topic/:topicId" element={<PostPage />} />

          {/* ---  (Placeholders) --- */}
          <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
          <Route path="/bookmarks" element={<PlaceholderPage title="Bookmarks" />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;