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

## Contribution

If you encounter any issues or have suggestions for improvement, feel free to raise an issue or submit a pull request. We welcome and appreciate your contributions!

## License

This project is licensed under the MIT License. For details, see the [LICENSE](LICENSE.md) file.
