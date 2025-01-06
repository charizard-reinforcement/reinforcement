import React from 'react';
import ReactDOM from 'react-dom/client';

function Popup() {
  return (
    <div>
      <h1>My Chrome Extension</h1>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);