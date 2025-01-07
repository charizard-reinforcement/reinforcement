import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const [errorMsg, seterrorMsg] = useState('');

  
    const handleLogin = async() => {
      // setisLoggedIn(true);
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Login Success:', data);
          setIsLoggedIn(true);
          seterrorMsg(''); 
        } else {
          seterrorMsg('Invalid credentials');
        }
      } catch (err) {
        seterrorMsg('An error occurred. Please try again.');
      }
    };

    const handleLogout = () => {
      setIsLoggedIn(false);
    };

    return (
      <div>
        {isLoggedIn ? (
          <div>
            <h2>Welcome, {username}!</h2>
            <button onClick={handleLogout}>Logout</button>
            <Popup />
          </div>
        ) : (
          <div>
            <h2>Login Page</h2>
              <div>
                <label>
                  Username:
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  Password:
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
              </div>
            <button onClick={handleLogin}>Login</button>
          </div>
        )}
      </div>
    );
  }
  
  // export default LoginPage;

// function Popup() {
//   return (
//     <div>
//       <h1>My Chrome Extension</h1>
//     </div>
//   );
// }

function Popup() {
  const [clipboardHistory, setClipboardHistory] = useState([]);

  useEffect(() => {
    console.log('Popup opened - fetching clipboard history');
    // Load clipboard history when popup opens
    chrome.storage.local.get(['clipboardHistory'], (result) => {
      console.log('Retrieved clipboard history:', result.clipboardHistory);
      if (result.clipboardHistory) {
        setClipboardHistory(result.clipboardHistory);
      }
    });
  }, []);

  const copyToClipboard = (text) => {
    console.log('Copying to clipboard:', text);
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log('Successfully copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy to clipboard:', err);
      });
  };

  console.log('Current clipboard history state:', clipboardHistory);

  return (
    <div className='p-4 w-80'>
      <h1 className='text-xl font-bold mb-4'>Clipboard History</h1>
      <div className='space-y-2'>
        {clipboardHistory.length === 0 ? (
          <p className='text-gray-500'>No items in clipboard history</p>
        ) : (
          clipboardHistory.map((item, index) => (
            <div
              key={index}
              className='p-2 border rounded hover:bg-gray-100 cursor-pointer group'
              onClick={() => copyToClipboard(item)}
            >
              <p className='truncate'>{item}</p>
              <p className='text-xs text-gray-500'>Click to copy</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LoginPage />
  </React.StrictMode>
);
