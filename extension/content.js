console.log('Content script loaded');
const INVENTORY_SIZE = 10;

document.addEventListener('copy', () => {
  console.log('Copy event detected');

  // Get the selected text
  const selectedText = window.getSelection().toString();
  console.log('Selected text:', selectedText);

  if (selectedText) {
    console.log('Valid text selected, updating clipboard history');

    addToInventory(selectedText);

    // Notify background script
    chrome.runtime.sendMessage(
      {
        type: 'COPY_EVENT',
        text: selectedText,
      },
      (response) => {
        console.log('Background script response:', response);
      },
    );

    // // Update clipboard history
    // chrome.storage.local.get(['clipboardHistory'], (result) => {
    //   console.log('Current clipboard history:', result.clipboardHistory);
    //   let history = result.clipboardHistory || [];

    //   // Add new item to the beginning of the array
    //   history.unshift(selectedText);
    //   console.log('Added new item to history');

    //   // Keep only the last 10 items
    //   history = history.slice(0, 10);
    //   console.log('Trimmed history to last 10 items');

    //   // Save updated history
    //   chrome.storage.local.set({ clipboardHistory: history }, () => {
    //     console.log('Saved updated clipboard history:', history);
    //     if (chrome.runtime.lastError) {
    //       console.error('Error saving to storage:', chrome.runtime.lastError);
    //     }
    //   });
    // });
  } else {
    console.log('No text selected during copy event');
  }
});

let startingHot = [null, null, null, null, null, null, null, null, null, null];

//let inventory = startingHot;
function setInventory(newVal) {
  chrome.storage.local.set({ clipboardHistory: newVal }, () => {
    console.log('Saved updated clipboard history:', newVal);
    if (chrome.runtime.lastError) {
      console.error('Error saving to storage:', chrome.runtime.lastError);
    }
    render();
  });
}

// function getInventory() {
//   chrome.storage.local.get(['clipboardHistory'], (result) => {
//     return result;
//   });
// }

let highlighted = -1;
function setHighlighted(newVal) {
  highlighted = newVal;
  render();
}

async function addToInventory(text) {
  chrome.storage.local.get(['clipboardHistory'], (response) => {
    for (let i = 0; i < INVENTORY_SIZE; i++) {
      if (response.clipboardHistory[i] === null) {
        let newInv = response.clipboardHistory.slice(0, i);
        newInv.push({ data: text });
        newInv.push(...response.clipboardHistory.slice(i + 1));

        setInventory(newInv);

        return;
      } else if (response.clipboardHistory[i] === undefined) {
        console.log('initing cause why not do it now');
        let newInv = startingHot;
        newInv[i] = { data: text };
        setInventory(newInv);
        return;
      }
    }
  });
}

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

function use(slot) {
  chrome.storage.local.get(['clipboardHistory'], (response) => {
    let temp = response.clipboardHistory[slot];
    let newInv = response.clipboardHistory.slice(0, slot);
    newInv.push(null);
    newInv.push(...response.clipboardHistory.slice(slot + 1));
    if (highlighted === slot) {
      setHighlighted(-1);
    }
    setInventory(newInv);

    copyToClipboard(temp.data);
  });
}

const keyDownFunction = (event) => {
  chrome.storage.local.get(['clipboardHistory'], (response) => {
    if (event.key.match(/[0-9]/g)) {
      let adjusted = Number(event.key) - 1;
      if (adjusted < 0) {
        adjusted = 9;
      }
      if (response.clipboardHistory[adjusted] !== null) {
        setHighlighted(adjusted);
        copyToClipboard(response.clipboardHistory[adjusted].data);
      }
    }
  });
};
window.document.addEventListener('keydown', keyDownFunction);

function render() {
  chrome.storage.local.get(['clipboardHistory'], (response) => {
    console.log(response);
    const DOMBODY = window.document.querySelector('body');
    const outerNode = document.createElement('div');

    outerNode.style.zIndex = 999999999;
    outerNode.style.margin = '0px';
    outerNode.style.position = 'fixed';
    //outerNode.style.backgroundColor = 'orange';

    outerNode.style.left = '0px';
    outerNode.style.top = 'calc(100vh - 120px)';
    outerNode.style.width = '100vw';
    outerNode.style.padding = 'auto';
    outerNode.style.display = 'flex';
    outerNode.style.justifyContent = 'center';

    for (let i = 0; i < 10; i++) {
      const innerNode = document.createElement('button');
      innerNode.style.backgroundColor = 'lightGray';
      if (i === highlighted) {
        innerNode.style.border = '5px solid black';
      } else {
        innerNode.style.border = '5px solid gray';
      }
      if (response.clipboardHistory[i] && response.clipboardHistory[i] !== null) {
        innerNode.innerText = response.clipboardHistory[i].data;
      } else {
        innerNode.innerText = null;
      }
      innerNode.onclick = () => {
        use(i);
      };
      innerNode.style.overflow = 'hidden';
      innerNode.style.margin = '0px';
      innerNode.style.width = '80px';
      innerNode.style.height = '80px';
      outerNode.appendChild(innerNode);
    }

    DOMBODY.appendChild(outerNode);
  });
}
render();
