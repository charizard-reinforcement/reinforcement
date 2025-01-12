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
  const [storedUsername, setStoredUsername] = useState('');

  // Check login status when component mounts
  useEffect(() => {
    chrome.storage.local.get(['isLoggedIn', 'username', 'userId'], (result) => {
      if (result.isLoggedIn) {
        setIsLoggedIn(true);
        setStoredUsername(result.username);
        // Fetch clipboard history for logged-in user
        fetchClipboardHistory(result.userId);
      }
    });
  }, []);

  const fetchClipboardHistory = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/hotbar/${userId}`
      );
      if (response.ok) {
        const clipboardData = await response.json();
        // Transform the data to match the expected format
        const transformedData = Array(10).fill(null);
        clipboardData.forEach((item, index) => {
          if (index < 10) {
            transformedData[index] = { data: item.data };
          }
        });
        // Store the transformed data in chrome.storage
        chrome.storage.local.set({ clipboardHistory: transformedData }, () => {
          console.log(
            'Clipboard history loaded from database:',
            transformedData
          );
        });
      } else {
        console.error('Failed to fetch clipboard history');
      }
    } catch (err) {
      console.error('Error fetching clipboard history:', err);
    }
  };

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
        setStoredUsername(username);
        // Store login status and username in chrome.storage
        chrome.storage.local.set({
          isLoggedIn: true,
          userId: data.userId,
          username: username,
        });
        // Fetch clipboard history after successful login
        await fetchClipboardHistory(data.userId);
      } else {
        setErrorMsg(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setErrorMsg('Connection error. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setStoredUsername('');
    // Clear all stored data from chrome.storage
    chrome.storage.local.remove([
      'isLoggedIn',
      'userId',
      'username',
      'clipboardHistory',
    ]);
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

  return (
    <div className='min-w-[300px] p-6 bg-white'>
      {isLoggedIn ? (
        <div className='space-y-6'>
          <h2 className='text-2xl font-bold text-gray-800'>
            Welcome, {storedUsername}!
          </h2>
          <button
            onClick={handleLogout}
            className='w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200'
          >
            Logout
          </button>
        </div>
      ) : (
        <div className='space-y-4'>
          <h2 className='text-2xl font-bold text-gray-800 text-center'>
            {isRegistering ? 'Register' : 'Login'}
          </h2>
          {errorMsg && (
            <div className='text-red-500 text-center py-2'>{errorMsg}</div>
          )}
          <div className='space-y-4'>
            <input
              type='text'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200'
            />
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200'
            />
            {isRegistering && (
              <>
                <input
                  type='email'
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200'
                />
                <input
                  type='text'
                  placeholder='First Name'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className='w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200'
                />
                <input
                  type='text'
                  placeholder='Last Name'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className='w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200'
                />
              </>
            )}
          </div>
          <button
            onClick={isRegistering ? handleRegister : handleLogin}
            className='w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200'
          >
            {isRegistering ? 'Register' : 'Login'}
          </button>
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className='w-full text-blue-500 hover:text-blue-600 transition-colors duration-200'
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
