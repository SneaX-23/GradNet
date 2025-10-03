import React from "react";
import LoginForm from "../components/auth/LoginForm";
import { useAuth } from "../hooks/useAuth";
import '../styles/pages/LoginPage.css';
import logo from '../assets/icons/gradnet-logo.png';

function Login() {

  const { 
    usn, 
    setUsn, 
    error, 
    isLoading, 
    handleLoginSubmit 
  } = useAuth();

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