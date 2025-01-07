console.log('Content script loaded');

document.addEventListener('copy', () => {
  console.log('Copy event detected');

  // Get the selected text
  const selectedText = window.getSelection().toString();
  console.log('Selected text:', selectedText);

  if (selectedText) {
    console.log('Valid text selected, updating clipboard history');
    // Notify background script
    chrome.runtime.sendMessage(
      {
        type: 'COPY_EVENT',
        text: selectedText,
      },
      (response) => {
        console.log('Background script response:', response);
      }
    );

    // Update clipboard history
    chrome.storage.local.get(['clipboardHistory'], (result) => {
      console.log('Current clipboard history:', result.clipboardHistory);
      let history = result.clipboardHistory || [];

      // Add new item to the beginning of the array
      history.unshift(selectedText);
      console.log('Added new item to history');

      // Keep only the last 10 items
      history = history.slice(0, 10);
      console.log('Trimmed history to last 10 items');

      // Save updated history
      chrome.storage.local.set({ clipboardHistory: history }, () => {
        console.log('Saved updated clipboard history:', history);
        if (chrome.runtime.lastError) {
          console.error('Error saving to storage:', chrome.runtime.lastError);
        }
      });
    });
  } else {
    console.log('No text selected during copy event');
  }
});
