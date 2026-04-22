const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false, // J.A.R.V.I.S. doesn't need standard window frames
    transparent: true,
    backgroundColor: '#00000000',
    title: "J.A.R.V.I.S. OS",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the app
  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  win.loadURL(startUrl);

  // EXTERNAL_EXTENSION_HOOK: Load neural bridges if present in local directory
  // if (!isDev) {
  //   const extensionPath = path.join(app.getAppPath(), 'bridges/neural-link');
  //   session.defaultSession.loadExtension(extensionPath)
  //     .then(({ name }) => console.log(`Neural_Bridge_Active: ${name}`))
  //     .catch(err => console.error('Uplink_Fault:', err));
  // }

  // Open external links in default browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
