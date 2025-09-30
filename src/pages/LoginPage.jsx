import React from "react";
import LoginForm from "../components/auth/LoginForm";
import { useAuth } from "../hooks/useAuth";

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
      <h1>GradNet Login</h1>
      <p>Connecting AITM, Across Generations</p>
      <LoginForm 
        usn={usn}
        setUsn={setUsn}
        onSubmit={handleLoginSubmit}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

export default Login;