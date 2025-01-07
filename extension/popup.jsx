import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';


function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const [errorMsg, seterrorMsg] = useState('');

  
    const handleLogin = async() => {
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
            <button onClick={() => setIsLoggedIn(false)}>Logout</button>
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LoginPage />
  </React.StrictMode>
);