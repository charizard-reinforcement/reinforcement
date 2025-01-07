console.log('Background script loaded');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed/updated - initializing clipboard history');
  // Initialize empty clipboard history
  chrome.storage.local.set({ clipboardHistory: [] }, () => {
    console.log('Clipboard history initialized');
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request);
  if (request.type === 'COPY_EVENT') {
    console.log('Processing copy event with text:', request.text);
    sendResponse({ status: 'received' });
  }
});
