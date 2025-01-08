// extension/popup.jsx
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        setErrorMsg('');
        // Store user ID in chrome.storage
        chrome.storage.local.set({ userId: data.userId });
      } else {
        setErrorMsg(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setErrorMsg('Connection error. Please try again.');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          email,
          firstName,
          lastName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsRegistering(false);
        setErrorMsg('Registration successful! Please login.');
      } else {
        setErrorMsg(data.message || 'Registration failed');
      }
    } catch (err) {
      setErrorMsg('Connection error. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    chrome.storage.local.remove('userId');
  };

  return (
    <div className='p-4'>
      {isLoggedIn ? (
        <div className='space-y-4'>
          <h2 className='text-xl font-bold'>Welcome, {username}!</h2>
          <button
            onClick={handleLogout}
            className='bg-red-500 text-white px-4 py-2 rounded'
          >
            Logout
          </button>
        </div>
      ) : (
        <div className='space-y-4'>
          <h2 className='text-xl font-bold'>
            {isRegistering ? 'Register' : 'Login'}
          </h2>
          {errorMsg && <div className='text-red-500'>{errorMsg}</div>}
          <div className='space-y-2'>
            <input
              type='text'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-full p-2 border rounded'
            />
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 border rounded'
            />
            {isRegistering && (
              <>
                <input
                  type='email'
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full p-2 border rounded'
                />
                <input
                  type='text'
                  placeholder='First Name'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className='w-full p-2 border rounded'
                />
                <input
                  type='text'
                  placeholder='Last Name'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className='w-full p-2 border rounded'
                />
              </>
            )}
          </div>
          <button
            onClick={isRegistering ? handleRegister : handleLogin}
            className='w-full bg-blue-500 text-white px-4 py-2 rounded'
          >
            {isRegistering ? 'Register' : 'Login'}
          </button>
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className='w-full text-blue-500'
          >
            {isRegistering ? 'Back to Login' : 'Create Account'}
          </button>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LoginPage />
  </React.StrictMode>
);
