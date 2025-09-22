# Tab Navigator Chrome Extension

A simple Chrome extension that allows quick switching to the most recently used tab.

## Features

- **Alt+Z**: Instantly switch to the most recently used tab
- **No popups or UI**: Clean, minimal interface
- **Reliable**: Uses Chrome's built-in `lastAccessed` timestamp for accurate tab ordering
- **No memory issues**: No internal state tracking that can get lost

## How It Works

1. Press **Alt+Z** (or your custom shortcut)
2. Extension queries Chrome for all tabs
3. Sorts tabs by `lastAccessed` timestamp (most recent first)
4. Switches to the second tab in the sorted list (most recently used before current)

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension will appear in your toolbar

## Keyboard Shortcut

- **Default**: Alt+Z
- **Customization**: You can change this in Chrome's extension settings
  - Go to `chrome://extensions/`
  - Find "Tab Navigator" and click "Details"
  - Click "Extension keyboard shortcuts"
  - Set your preferred shortcut

## Technical Details

- **Manifest V3**: Modern Chrome extension architecture
- **Background Script**: Handles keyboard commands and tab switching
- **Chrome Tabs API**: Direct integration with Chrome's tab management
- **No Content Scripts**: Minimal permissions and overhead

## Files

- `manifest.json` - Extension configuration and permissions
- `background.js` - Main extension logic
- `icon16.png`, `icon48.png`, `icon128.png` - Extension icons

## Permissions

- `tabs` - Required to query and switch between tabs
- `commands` - Required for keyboard shortcut functionality

## Why This Approach?

Unlike other tab switching extensions that maintain internal history:
- **No memory issues** - Chrome handles all tab state
- **Always accurate** - Uses Chrome's native timestamp data
- **Reliable** - Works even after extension restarts or Chrome updates
- **Simple** - Minimal code, fewer potential failure points

## Usage Tips

- The extension works on all page types, including `chrome://` pages
- Works with any number of tabs (minimum 2 required)
- Automatically filters out popup windows
- No configuration needed - just install and use

## Troubleshooting

If Alt+Z doesn't work:
1. Check if another extension or application is using the same shortcut
2. Try setting a custom shortcut in Chrome's extension settings
3. Ensure the extension is enabled and loaded properly 