import './styles/App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
import DashboardPage from './pages/DashboardPage';
import BookmarksPage from './pages/BookmarksPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 2000,
          borderRadius: '50%',
          backdropFilter: 'blur(6px)',
        }}>
        </div>

        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/submit-auth-info" element={<VerifyOtp />} />
          <Route path="/create-profile" element={<CreateProfilePage />} />

          {/* Main App Routes */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:handle" element={<UserProfilePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />

          {/* Forum Routes */}
          <Route path="/forums" element={<ForumPage />} />
          <Route path="/forums/:forumId" element={<TopicPage />} />
          <Route path="/topic/:topicId" element={<PostPage />} />

          {/* Admin / Faculty Routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
