import React, { useState } from 'react';

const [inventory, setInventory] = useState([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]);

function Hotbar(props) {
  const domSlots = [];
  for (let i = 0; i < inventory.length; i++) {
    domSlots += <div key={i}>{i}</div>;
  }

  return <div>{domSlots}</div>;
}
