# Copytory

A Minecraft-inspired clipboard manager Chrome extension that gives you quick access to your 10 most recent copy/cut items.

![Copytory Logo](assets/copytoryLogo128.png)

## Features

- Store up to 10 most recent copied/cut text items
- Minecraft-style hotbar interface
- Quick access using number keys (1-0)
- Click to select and copy items
- Visual highlighting of selected item
- Persistent storage across browser sessions
- Works on any webpage
- Minimalist design that stays out of your way

## How to Use

1. **Copy/Cut Text**: Use normal keyboard shortcuts (Ctrl+C/Ctrl+X) or right-click menu to copy/cut text
2. **Access History**: The Minecraft-style hotbar appears at the bottom of your browser window
3. **Select Items**:
   - Press number keys 1-9 (or 0 for the last slot) to quickly copy items
   - Click on any slot to select and copy its content
4. **Visual Feedback**:
   - Selected slot is highlighted with a white border
   - Hover effects indicate which slots contain text
   - Each slot shows a preview of its stored text

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The extension will be installed and ready to use

## Technical Details

- Built using Chrome Extension Manifest V3
- Uses Chrome Storage API for persistent data
- Implements clipboard events handling
- Content script injection for DOM manipulation
- Background service worker for extension lifecycle management

## Permissions

The extension requires the following permissions:

- `storage`: To save clipboard history
- `clipboardRead`: To detect copy/cut events
- `clipboardWrite`: To allow copying from the hotbar
- `<all_urls>`: To work on any webpage

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.
