import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import { useAuth as useLoginHook } from "../hooks/useAuth";
import { useAuth } from "../context/AuthContext"; 
import '../styles/pages/LoginPage.css';
import logo from '../assets/icons/gradnet-logo.png';

function Login() {

  const { 
    usn, 
    setUsn, 
    error, 
    isLoading, 
    handleLoginSubmit 
  } = useLoginHook();

  const { isLoggedIn, loading: authLoading } = useAuth();
  const navigate = useNavigate();

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
        <LoginForm 
          usn={usn}
          setUsn={setUsn}
          onSubmit={handleLoginSubmit}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}

export default Login;