import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  IpcMainEvent,
  IpcMain,
} from "electron";
import { release } from "node:os";
import { join } from "node:path";
import { update } from "./update";

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// ClientId вашего приложения
// Приложение создается тут https://oauth.yandex.ru/client/new
const CLIENT_ID = "23cabbbdc6cd418abb4b39c32c41195d"; // "74c9958a32324ab0881a8f232e1ac423";
// Можно указать какой пожелаете, главное чтобы яндекс не жаловался на невалидность url, иначе будет ошибка при попытке редиректа
// Указывается при создании приложения
// Важно, в конце должен быть '/', но только в CALLBACK_URL, фильтр запросов требует path
const CALLBACK_URL = "https://music.yandex.ru/"; //"http://localhost/ok/";
const AUTH_URL = `https://oauth.yandex.ru/authorize?response_type=token&client_id=${CLIENT_ID}`;
const REQUEST_FILTER = { urls: [CALLBACK_URL] };

//Паттерн позволяет достать сразу токен и время истечения токена
const REGEX_PATTERN = /access_token=([^&]*).+expires_in=(\d+)/is;

function createLoginWindow(event: IpcMainEvent) {
  let authWindow = new BrowserWindow({
    center: true,
    minimizable: false,
    closable: true,
    maximizable: false,
    autoHideMenuBar: true,
    skipTaskbar: true,
    show: false,
    fullscreenable: false,
    backgroundColor: "black",
    width: 440,
    height: 750,
    maxHeight: 750,
    maxWidth: 440,
    minHeight: 750,
    minWidth: 440,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    authWindow.webContents.openDevTools();
  }

  authWindow.once("ready-to-show", () => {
    authWindow.show();
  });

  authWindow.once("closed", () => {
    authWindow.removeAllListeners();
    authWindow = null;
  });

  win.once("close", () => {
    if (authWindow != null) authWindow.close();
  });

  let defaultSession = getDefaultSession();
  defaultSession.webRequest.onBeforeRequest(
    REQUEST_FILTER,
    (details, callback) => {
      details.webContents.session.cookies
        .get({
          name: "uniqueuid",
        })
        .then(([{ value }]) => {
          event.sender.send("auth-info", {
            ...ParseAuthInfo(details.url),
            uid: value,
          });
        });

      authWindow.close();
    }
  );

  authWindow.loadURL(AUTH_URL);
}

function ParseAuthInfo(url: string) {
  let regexMath = url.match(REGEX_PATTERN) || [];
  let token = regexMath?.[1];
  let expires = Number(regexMath?.[2]);
  return {
    token,
    expires,
  };
}

function getDefaultSession(): Electron.Session {
  const { session } = require("electron");
  return session.defaultSession;
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    icon: join(process.env.PUBLIC, "favicon.ico"),
    titleBarStyle: "hiddenInset",
    transparent: true,
    frame: false,
    width: 1300,
    height: 900,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  // createPlayerWindow(ipcMain);

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  ipcMain.on("auth-window", function (event: IpcMainEvent) {
    createLoginWindow(event);
  });

  ipcMain.on("logout", (event) => {
    let defaultSession = getDefaultSession();
    defaultSession.clearStorageData();
    event.sender.send("logout-processed");
  });

  // Apply electron-updater
  update(win);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
