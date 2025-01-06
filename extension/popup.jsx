import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

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
            </div>
          ))
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
