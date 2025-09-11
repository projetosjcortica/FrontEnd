import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';



const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

let win: BrowserWindow | null;


const dataFilePath = path.join(app.getPath('userData'), 'formData.json');

interface FormData {
  serverDB?: string;
  userDB?: string;
  passwordDB?: string;
  database?: string;
  [key: string]: string | undefined; // outras chaves possíveis
}

interface AppData {
  formData?: FormData;
  [key: string]: unknown; // outras chaves possíveis
}

function readJSON(filePath: string): AppData {
  if (!fs.existsSync(filePath)) return {};
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as AppData;
  } catch (err) {
    console.error('Erro ao fazer parse do JSON:', err);
    return {};
  }
}

function writeJSON(filePath: string, data: AppData): boolean {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Erro ao salvar JSON:', err);
    return false;
  }
}

// IPC Handlers
ipcMain.handle('save-data', async (_event, key: string, value: string | number | boolean): Promise<boolean> => {
  try {
    const existingData = readJSON(dataFilePath) || {  };
    existingData[key] = value;
    const saved = writeJSON(dataFilePath, existingData);
    if (!saved) throw new Error('Falha ao salvar dados');
    return true;
  } catch (err) {
    console.error('Erro ao salvar dados:', err);
    return false;
  }
});

ipcMain.handle('load-data', async (_event, key: string): Promise< unknown |string | number | boolean | null > => {
  try {
    const data = readJSON(dataFilePath); 
    if (!data) return {}; 
    return data[key] || {};
  } catch (err) {
    console.error("Erro ao carregar dados:", err);
    return {};
  }
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });

  if (result.canceled || result.filePaths.length === 0) {
    console.log('Nenhuma pasta selecionada');
    return null;
  }

  const folderPath = result.filePaths[0];
  console.log('Pasta selecionada:', folderPath);
  return folderPath;
});

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC!, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  });

  win.maximize(),

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }
}

app.whenReady().then(() => {
  const rawData = readJSON(dataFilePath);
  const formData = rawData.formData || {};

  const dbConfig = {
    server: formData.serverDB || 'localhost',
    user: formData.userDB || 'root',
    password: formData.passwordDB || '',
    database: formData.database || 'testes',
  };

  console.log('Configuração do banco enviada:', dbConfig);

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 🧼 Encerrar backend e app corretamente
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
});

// Logging
const logFilePath = path.join(app.getPath('userData'), 'error.log');
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

process.on('uncaughtException', (error: Error) => {
  logStream.write(`[${new Date().toISOString()}] Uncaught Exception: ${error.stack}\n`);
});

process.on('unhandledRejection', (reason) => {
  logStream.write(`[${new Date().toISOString()}] Unhandled Rejection: ${reason}\n`);
});
