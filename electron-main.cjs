const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { exec, spawn } = require('child_process');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    frame: false, 
    transparent: true,
    backgroundColor: '#00000000',
    title: "J.A.R.V.I.S. Core",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, 'dist/index.html')}`;

  win.loadURL(startUrl);

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

// --- SYSTEM_WIDE_INTEGRATION ---

// 1. App Synchronization Logic
ipcMain.handle('sync-apps', async () => {
  const platform = process.platform;
  let apps = [];

  try {
    if (platform === 'win32') {
      // Windows: Scan Start Menu for shortcuts
      const startMenuPaths = [
        path.join(process.env.ProgramData, 'Microsoft/Windows/Start Menu/Programs'),
        path.join(process.env.AppData, 'Microsoft/Windows/Start Menu/Programs')
      ];
      
      const scanDir = (dir) => {
        if (!fs.existsSync(dir)) return;
        const files = fs.readdirSync(dir, { withFileTypes: true });
        files.forEach(file => {
          if (file.isDirectory()) scanDir(path.join(dir, file.name));
          else if (file.name.endsWith('.lnk')) {
            apps.push({ name: file.name.replace('.lnk', ''), path: path.join(dir, file.name) });
          }
        });
      };
      startMenuPaths.forEach(scanDir);
    } else if (platform === 'darwin') {
      // macOS: Scan /Applications
      const files = fs.readdirSync('/Applications');
      apps = files.filter(f => f.endsWith('.app')).map(f => ({ name: f.replace('.app', ''), path: `/Applications/${f}` }));
    } else {
      // Linux: Scan /usr/share/applications
      const files = fs.readdirSync('/usr/share/applications');
      apps = files.filter(f => f.endsWith('.desktop')).map(f => ({ name: f.replace('.desktop', ''), path: `/usr/share/applications/${f}` }));
    }
  } catch (e) {
    console.error("App Sync Fault:", e);
  }

  return apps;
});

// 2. Open Application
ipcMain.handle('open-app', async (event, appPath) => {
  if (process.platform === 'win32') {
    spawn('explorer', [appPath]);
  } else {
    shell.openPath(appPath);
  }
  return { status: 'success' };
});

// 3. Lock PC
ipcMain.handle('lock-system', async () => {
  const platform = process.platform;
  if (platform === 'win32') {
    exec('rundll32.exe user32.dll,LockWorkStation');
  } else if (platform === 'darwin') {
    exec('/System/Library/CoreServices/Menu\\ Extras/User.menu/Contents/Resources/CGSession -suspend');
  } else {
    exec('loginctl lock-session');
  }
  return { status: 'locked' };
});

// 4. Autostart Configuration
ipcMain.handle('configure-autostart', async (event, enabled) => {
  app.setLoginItemSettings({
    openAtLogin: enabled,
    path: app.getPath('exe'),
  });
  return { status: enabled ? 'enabled' : 'disabled' };
});

app.whenReady().then(() => {
  createWindow();
  
  // Default to Autostart enabled for JARVIS
  app.setLoginItemSettings({
    openAtLogin: true,
    path: app.getPath('exe'),
  });
});

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
