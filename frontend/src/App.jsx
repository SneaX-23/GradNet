import './styles/App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import VerifyOtp from './pages/VerifyOtpPage';
import { AuthProvider } from './context/AuthContext'; 
import HomePage from './pages/HomePage';
import CreateProfilePage from './pages/CreaeteProfilePage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/submit-auth-info' element={<VerifyOtp />} />
          <Route path='/home' element={<HomePage />}/>
          <Route path="/create-profile" element={<CreateProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;