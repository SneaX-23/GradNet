import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initiateLogin } from '../services/authService';

export const useAuth = () => {
  const navigate = useNavigate();
  const [usn, setUsn] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await initiateLogin(usn);
      console.log("Data received from backend:", data);
      navigate('/submit-auth-info', { state: { email: data.email, status: data.status } });

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  return {
    usn,
    setUsn,
    error,
    isLoading,
    handleLoginSubmit,
  };
};