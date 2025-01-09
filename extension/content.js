console.log('Content script loaded');
const INVENTORY_SIZE = 10;

addEventListener('focus', (event) => {
  render();
});

// paste event is after it happens
// but we can delete the selected
window.addEventListener('paste', (event) => {
  use(highlighted);
});

document.addEventListener('copy', (event) => {
  console.log('Copy event detected');
  cutCopyEvent(event);
});

document.addEventListener('cut', (event) => {
  console.log('Cut event detected');

  cutCopyEvent(event);
});

function cutCopyEvent(event) {
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
  } else {
    console.log('No text selected during copy event');
  }
}

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
        setHighlighted(i);

        return;
      } else if (response.clipboardHistory[i] === undefined) {
        console.log('initing cause why not do it now');
        let newInv = startingHot;
        newInv[i] = { data: text };
        setInventory(newInv);
        setHighlighted(i);
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
    // if (highlighted === slot) {
    //   setHighlighted(-1); // actually, no matter what, we should not higlight anyhting after this cause you just used the thing.
    // }
    setInventory(newInv);
    //setHighlighted(-1); // or we could let it stay black and empty???
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
      if (response.clipboardHistory[adjusted] && response.clipboardHistory[adjusted] !== null) {
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

    // Remove existing hotbar if present
    const existingHotbar = DOMBODY.querySelector('#minecraft-hotbar');
    if (existingHotbar) {
      existingHotbar.remove();
    }

    const outerNode = document.createElement('div');
    outerNode.id = 'minecraft-hotbar';

    // Minecraft hotbar styling
    outerNode.style.zIndex = 999999999;
    outerNode.style.position = 'fixed';
    outerNode.style.left = '50%';
    outerNode.style.transform = 'translateX(-50%)';
    outerNode.style.bottom = '20px';
    outerNode.style.display = 'flex';
    outerNode.style.gap = '4px';
    outerNode.style.padding = '8px';
    outerNode.style.background = 'rgba(0, 0, 0, 0.75)';
    outerNode.style.borderRadius = '8px';
    outerNode.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';

    for (let i = 0; i < 10; i++) {
      const slotContainer = document.createElement('div');
      const innerNode = document.createElement('button');

      // Slot number styling (Minecraft-style)
      const slotNumber = document.createElement('div');
      slotNumber.innerText = i === 9 ? '0' : (i + 1).toString();
      slotNumber.style.position = 'absolute';
      slotNumber.style.bottom = '2px';
      slotNumber.style.right = '4px';
      slotNumber.style.color = 'white';
      slotNumber.style.fontSize = '12px';
      slotNumber.style.textShadow = '1px 1px 1px rgba(0, 0, 0, 0.8)';

      // Container styling
      slotContainer.style.position = 'relative';
      slotContainer.style.width = '64px';
      slotContainer.style.height = '64px';

      // Minecraft slot styling
      innerNode.style.width = '100%';
      innerNode.style.height = '100%';
      innerNode.style.backgroundColor = '#8B8B8B';
      innerNode.style.border = '2px solid #373737';
      innerNode.style.boxSizing = 'border-box';
      innerNode.style.display = 'flex';
      innerNode.style.alignItems = 'center';
      innerNode.style.justifyContent = 'center';
      innerNode.style.padding = '4px';
      innerNode.style.cursor = 'pointer';
      innerNode.style.position = 'relative';
      innerNode.style.fontFamily = 'Arial, sans-serif';
      innerNode.style.overflow = 'hidden';

      // Selected slot styling (highlighted)
      if (i === highlighted) {
        innerNode.style.border = '2px solid #ffffff';
        innerNode.style.backgroundColor = '#6B6B6B';
      }

      // Content styling
      if (response && response.clipboardHistory[i] && response.clipboardHistory[i] !== null) {
        innerNode.innerText = response.clipboardHistory[i].data;
        innerNode.style.color = 'white';
        innerNode.style.textShadow = '1px 1px 1px rgba(0, 0, 0, 0.8)';

        // Dynamic font sizing
        let textLength = response.clipboardHistory[i].data.length;
        let fontSize = Math.min(16, Math.max(8, 160 / textLength));
        innerNode.style.fontSize = `${fontSize}px`;

        // Minecraft item slot gradient
        innerNode.style.backgroundImage = 'linear-gradient(45deg, #8B8B8B 25%, #9B9B9B 50%, #8B8B8B 75%)';
      } else {
        // Empty slot styling
        innerNode.style.backgroundColor = '#8B8B8B';
        innerNode.style.border = '2px solid #373737';
        innerNode.style.borderBottom = '2px solid #5B5B5B';
        innerNode.style.borderRight = '2px solid #5B5B5B';
      }

      // Click handler
      innerNode.onclick = () => {
        if (response.clipboardHistory[i] && response.clipboardHistory[i] !== null) {
          setHighlighted(i);
          copyToClipboard(response.clipboardHistory[i].data);
        }
      };

      // Hover effect
      innerNode.onmouseover = () => {
        if (response.clipboardHistory[i] && response.clipboardHistory[i] !== null) {
          innerNode.style.backgroundColor = '#9B9B9B';
        }
      };

      innerNode.onmouseout = () => {
        if (response.clipboardHistory[i] && response.clipboardHistory[i] !== null) {
          innerNode.style.backgroundColor = '#8B8B8B';
        }
      };

      slotContainer.appendChild(innerNode);
      slotContainer.appendChild(slotNumber);
      outerNode.appendChild(slotContainer);
    }

    DOMBODY.appendChild(outerNode);
  });
}
render();
