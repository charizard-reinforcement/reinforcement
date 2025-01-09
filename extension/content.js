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

      //innerNode.style.backgroundColor = 'lightGray';
      if (i === highlighted) {
        innerNode.style.border = '5px solid black';
      } else {
        innerNode.style.border = '5px solid gray';
      }
      console.log(response.clipboardHistory[i]);
      if (response && response.clipboardHistory[i] && response.clipboardHistory[i] !== null) {
        innerNode.innerText = response.clipboardHistory[i].data;
        innerNode.style.backgroundImage = 'linear-gradient(to top right, lightgrey, white)';
      } else {
        innerNode.innerText = null;
        innerNode.style.backgroundColor = 'lightgray';
      }
      innerNode.onclick = () => {
        if (response !== undefined && response.clipboardHistory[i] && response.clipboardHistory[i] !== null) {
          setHighlighted(i);
          copyToClipboard(response.clipboardHistory[i].data);
        }
      };
      innerNode.style.overflow = 'hidden';
      innerNode.style.color = 'black';
      if (response.clipboardHistory[i] && response.clipboardHistory[i].data) {
        let fontZise; // should be avaliable space / number of letters around to equals the size of each
        if (response.clipboardHistory[i].data.length < 10) {
          fontZise = 22;
        } else if (response.clipboardHistory[i].data.length < 20) {
          // the math dosent math very well uwith thhis small of numbers
          fontZise = 14;
        } else {
          // mathematically
          // we have a certan area for the box in square px then we have each char taking up its height in px * its height in px square px (aruend), so the square of the nessesary height of each char is equal to the space allowed / the number of chars needed
          // ie eachheight squared = allocated size / number of items
          let constantAreaForBox = 6000;
          let squaredOfZise = constantAreaForBox / response.clipboardHistory[i].data.length;
          fontZise = Math.sqrt(squaredOfZise);
        }

        if (fontZise < 1) fontZise = 1;
        innerNode.style.fontSize = `${fontZise}px`;
      }

      innerNode.style.margin = '0px';
      innerNode.style.width = '80px';
      innerNode.style.height = '80px';
      innerNode.style.overflowWrap = 'normal'; // lol, i think this is actually best
      outerNode.appendChild(innerNode);
    }

    DOMBODY.appendChild(outerNode);
  });
}
render();
