import { app, BrowserWindow } from "electron";

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 450,
    height: 150,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    transparent: true,
    frame: false,
    title: "Selenite",
    hasShadow: false,
    /* resizable: false, */
  });

  mainWindow.loadURL('http://localhost:3000/index.html');
};

app.whenReady().then(() => {
  createMainWindow();
});