import { app as s, ipcMain as f, dialog as v, BrowserWindow as w } from "electron";
import { fileURLToPath as D } from "node:url";
import r from "node:path";
import c from "node:fs";
import { spawn as S } from "node:child_process";
const p = r.dirname(D(import.meta.url));
process.env.APP_ROOT = r.join(p, "..");
const d = process.env.VITE_DEV_SERVER_URL, T = r.join(process.env.APP_ROOT, "dist-electron"), g = r.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = d ? r.join(process.env.APP_ROOT, "public") : g;
let a, i;
const l = r.join(s.getPath("userData"), "formData.json");
function u(o) {
  if (!c.existsSync(o)) return {};
  try {
    const e = c.readFileSync(o, "utf-8");
    return JSON.parse(e);
  } catch (e) {
    return console.error("Erro ao fazer parse do JSON:", e), {};
  }
}
function E(o, e) {
  try {
    return c.writeFileSync(o, JSON.stringify(e, null, 2), "utf-8"), !0;
  } catch (t) {
    return console.error("Erro ao salvar JSON:", t), !1;
  }
}
f.handle("save-data", async (o, e, t) => {
  try {
    const n = u(l);
    if (n[e] = t, !E(l, n)) throw new Error("Falha ao salvar dados");
    return !0;
  } catch (n) {
    return console.error("Erro ao salvar dados:", n), !1;
  }
});
f.handle("load-data", async (o, e) => {
  try {
    const n = u(l)[e];
    return typeof n == "string" || typeof n == "number" || typeof n == "boolean" ? n : null;
  } catch (t) {
    return console.error("Erro ao carregar dados:", t), null;
  }
});
f.handle("select-folder", async () => {
  const o = await v.showOpenDialog({
    properties: ["openDirectory"]
  });
  if (o.canceled || o.filePaths.length === 0)
    return console.log("Nenhuma pasta selecionada"), null;
  const e = o.filePaths[0];
  return console.log("Pasta selecionada:", e), e;
});
function h() {
  a = new w({
    icon: r.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: r.join(p, "preload.mjs")
    }
  }), a.webContents.on("did-finish-load", () => {
    a == null || a.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), d ? a.loadURL(d) : a.loadFile(r.join(g, "index.html"));
}
s.whenReady().then(() => {
  const e = u(l).formData || {}, t = {
    server: e.serverDB || "localhost",
    user: e.userDB || "root",
    password: e.passwordDB || "",
    database: e.database || "testes"
  };
  console.log("Configuração do banco enviada:", t), i = S(
    "node",
    [r.join(p, "../services/UseCase/GetTable.js"), JSON.stringify(t)],
    {
      stdio: "inherit",
      windowsHide: !0
    }
  ), h(), s.on("activate", () => {
    w.getAllWindows().length === 0 && h();
  });
});
s.on("window-all-closed", () => {
  i && i.kill(), process.platform !== "darwin" && s.quit();
});
s.on("will-quit", () => {
  i && i.kill();
});
const P = r.join(s.getPath("userData"), "error.log"), m = c.createWriteStream(P, { flags: "a" });
process.on("uncaughtException", (o) => {
  m.write(`[${(/* @__PURE__ */ new Date()).toISOString()}] Uncaught Exception: ${o.stack}
`);
});
process.on("unhandledRejection", (o) => {
  m.write(`[${(/* @__PURE__ */ new Date()).toISOString()}] Unhandled Rejection: ${o}
`);
});
export {
  T as MAIN_DIST,
  g as RENDERER_DIST,
  d as VITE_DEV_SERVER_URL
};
