import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import Store from 'electron-store';

const store = new Store();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Fix for "Access is denied" cache errors on Windows
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    titleBarStyle: 'hiddenInset',
    icon: path.join(__dirname, '../public/vite.svg'),
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

// IPC Handlers
ipcMain.handle('get-events', () => {
  return store.get('events', []);
});

ipcMain.handle('save-event', (event, newEvent) => {
  const events = store.get('events', []);
  events.push({ ...newEvent, id: Date.now().toString() });
  store.set('events', events);
  return events;
});

ipcMain.handle('delete-event', (event, id) => {
  let events = store.get('events', []);
  events = events.filter(e => e.id !== id);
  store.set('events', events);
  return events;
});

ipcMain.handle('update-event', (event, updatedEvent) => {
  let events = store.get('events', []);
  events = events.map(e => e.id === updatedEvent.id ? updatedEvent : e);
  store.set('events', events);
  return events;
});

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
