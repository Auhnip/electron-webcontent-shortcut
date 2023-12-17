# electron-webcontents-shortcut

## Overview

This project is inspired by another project, [electron-localshortcut](https://www.npmjs.com/package/electron-localshortcut), with a similar implementation principle but enhanced functionality. In comparison to `electron-localshortcut`, this project offers greater flexibility, allowing users to freely bind shortcuts in the multi-process environment of Electron applications, including `BrowserWindow`, `BrowserView`, and `Webview`.

## Background

In `electron-localshortcut`, shortcuts can only be bound to a `BrowserWindow`, limiting its use in Electron applications with multiple processes that may involve the use of `BrowserView` or `Webview`. To address this limitation, this project relaxes the constraints imposed by `electron-localshortcut`, enabling users to bind shortcuts to any source of `WebContents`, thus better accommodating the needs of multi-process applications.

## Features

- **Flexibility**: Shortcuts can be bound to sources from any `WebContents`, including `BrowserWindow`, `BrowserView`, `Webview`, and more.

## Installation

Install via npm:

```bash
npm install electron-webcontents-shortcut
```

## Usage

Import this module into your Electron project:

```javascript
const shortcutManager = require('electron-webcontents-shortcut');
```

Then, use the following methods to bind shortcuts:

```javascript
const { register } = shortcutManager;

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 600,
    height: 400,
  });

  win.loadURL('https://www.electronjs.org//');

  register(win.webContents, 'Ctrl+Shift+O', () => {
    console.log('Ctrl+Shift+O');
    win.webContents.openDevTools({ mode: 'detach' });
  });
});
```

## API

### 1. `isAccelerator(input: string): boolean`

Checks whether a given string is a valid representation of a keyboard accelerator. A valid accelerator should consist of any number of modifier keys followed by a regular key. For example, `Shift+Alt+P`.

### 2. `unregisterAll(webContents: WebContents): void`

Unregisters all keyboard shortcuts associated with the specified `webContents`.

### 3. `register(webContents: WebContents, accelerator: string | string[], callback: () => void): void`

Registers a keyboard shortcut on the specified `webContents`. The `accelerator` parameter can be a string or an array of strings representing the keyboard shortcut(s), and the `callback` function will be invoked when the shortcut is triggered.

### 4. `unregister(webContents: WebContents, accelerator: string | string[]): void`

Unregisters the specified keyboard shortcut(s) associated with the given `webContents`.

### 5. `isRegistered(webContents: WebContents, accelerator: string): boolean`

Checks whether a specific keyboard shortcut is registered on the specified `webContents`.

### Example Usage

```javascript
const {
  isAccelerator,
  register,
  unregister,
  unregisterAll,
  isRegistered,
} = require('electron-webcontents-shortcut');

// Check if a string is a valid accelerator
if (isAccelerator('Ctrl+A')) {
  const webContents = // ... obtain WebContents instance
    // Register a keyboard shortcut
    register(webContents, 'Ctrl+A', () => {
      // Handle the shortcut
    });

  // Check if a shortcut is registered
  if (isRegistered(webContents, 'Ctrl+A')) {
    // Do something
  }

  // Unregister a shortcut
  unregister(webContents, 'Ctrl+A');

  // Unregister all shortcuts
  unregisterAll(webContents);
}
```

## Contribution

If you encounter any issues or have suggestions for improvement, feel free to raise an issue or submit a pull request. We welcome and appreciate your contributions!

## License

This project is licensed under the MIT License. For details, see the [LICENSE](LICENSE.md) file.
