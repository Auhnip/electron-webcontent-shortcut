import { BrowserView, BrowserWindow, app } from 'electron';
import path from 'node:path';
import { register } from '..';

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 600,
    height: 400,
  });

  win.loadURL('https://cn.bing.com');

  const view = new BrowserView({ webPreferences: {} });

  win.addBrowserView(view);
  view.setBounds({ x: 0, y: 0, width: 300, height: 400 });
  view.webContents.loadURL('https://www.electronjs.org//');
  register(view.webContents, 'Ctrl+Shift+Up', () => {
    console.log('Ctrl+Shift+O');
    view.webContents.openDevTools({ mode: 'detach' });
  });
});
