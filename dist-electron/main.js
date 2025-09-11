import { app, ipcMain, dialog, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
const dataFilePath = path.join(app.getPath("userData"), "formData.json");
function readJSON(filePath) {
  if (!fs.existsSync(filePath)) return {};
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Erro ao fazer parse do JSON:", err);
    return {};
  }
}
function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Erro ao salvar JSON:", err);
    return false;
  }
}
ipcMain.handle("save-data", async (_event, key, value) => {
  try {
    const existingData = readJSON(dataFilePath) || {};
    existingData[key] = value;
    const saved = writeJSON(dataFilePath, existingData);
    if (!saved) throw new Error("Falha ao salvar dados");
    return true;
  } catch (err) {
    console.error("Erro ao salvar dados:", err);
    return false;
  }
});
ipcMain.handle("load-data", async (_event, key) => {
  try {
    const data = readJSON(dataFilePath);
    if (!data) return {};
    return data[key] || {};
  } catch (err) {
    console.error("Erro ao carregar dados:", err);
    return {};
  }
});
ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"]
  });
  if (result.canceled || result.filePaths.length === 0) {
    console.log("Nenhuma pasta selecionada");
    return null;
  }
  const folderPath = result.filePaths[0];
  console.log("Pasta selecionada:", folderPath);
  return folderPath;
});
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.maximize(), win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.whenReady().then(() => {
  const rawData = readJSON(dataFilePath);
  const formData = rawData.formData || {};
  const dbConfig = {
    server: formData.serverDB || "localhost",
    user: formData.userDB || "root",
    password: formData.passwordDB || "",
    database: formData.database || "testes"
  };
  console.log("Configuração do banco enviada:", dbConfig);
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("will-quit", () => {
});
const logFilePath = path.join(app.getPath("userData"), "error.log");
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });
process.on("uncaughtException", (error) => {
  logStream.write(`[${(/* @__PURE__ */ new Date()).toISOString()}] Uncaught Exception: ${error.stack}
`);
});
process.on("unhandledRejection", (reason) => {
  logStream.write(`[${(/* @__PURE__ */ new Date()).toISOString()}] Unhandled Rejection: ${reason}
`);
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
