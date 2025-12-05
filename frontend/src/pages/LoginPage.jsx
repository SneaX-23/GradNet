import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Divider, Alert } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import LoginForm from "../components/auth/LoginForm";
import NeoButton from "../components/NeoButton";
import { useAuth as useLoginHook } from "../hooks/useAuth";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config";
import '../styles/pages/LoginPage.css';
import logo from '../assets/icons/gradnet-logo.png';

function Login() {
  const location = useLocation(); 
  const [googleError, setGoogleError] = useState(''); 

  const { 
    usn, 
    setUsn, 
    error: usnError,
    isLoading, 
    handleLoginSubmit 
  } = useLoginHook();

  const { isLoggedIn, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const errorMsg = queryParams.get('error');
    
    if (errorMsg) {
      setGoogleError(decodeURIComponent(errorMsg));
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      navigate('/home');
    }
  }, [isLoggedIn, authLoading, navigate]);

  if (authLoading || isLoggedIn) {
    return (
      <div className="login-page-container">
        <p style={{ color: 'white', fontFamily: "'Courier New', Courier, monospace" }}>
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="login-page-container">
      <div className="login-card">
        <img src={logo} alt="GradNet Logo" className="login-logo" /> 
        <h1>GradNet</h1>
        <p className="subtitle">Connecting AITM, Across Generations</p>
        
        {googleError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 0, border: '2px solid #ef4444' }}>
                {googleError}
            </Alert>
        )}

        <LoginForm 
          usn={usn}
          setUsn={setUsn}
          onSubmit={handleLoginSubmit}
          isLoading={isLoading}
          error={usnError}
        />

        <Box sx={{ my: 3, display: 'flex', alignItems: 'center', width: '100%' }}>
            <Divider sx={{ flexGrow: 1, bgcolor: '#18181b', borderBottomWidth: 2 }} />
            <span style={{ 
                padding: '0 10px', 
                fontFamily: '"Space Mono", monospace', 
                fontSize: '0.9rem', 
                color: '#4a4a4a', 
                fontWeight: 'bold' 
            }}>
                OR
            </span>
            <Divider sx={{ flexGrow: 1, bgcolor: '#18181b', borderBottomWidth: 2 }} />
        </Box>

        <NeoButton
            fullWidth
            href={`${API_BASE_URL}/api/google`}
            startIcon={<GoogleIcon />}
            sx={{
                backgroundColor: '#ffffff',
                color: '#18181b',
                '&:hover': {
                    backgroundColor: '#f5f5f5',
                }
            }}
        >
            Login with Google
        </NeoButton>

      </div>
    </div>
  );
}

export default Login;