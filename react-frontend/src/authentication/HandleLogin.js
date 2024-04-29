import React from 'react';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function HandleLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/profile');
    } else {
      navigate('/login'); // redirect back to login if no token found
    }
  }, [location, navigate]);

  return (
    <div>Loading...</div>
  );
}

export default HandleLogin;