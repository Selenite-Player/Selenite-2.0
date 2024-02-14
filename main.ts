import { app, BrowserWindow, ipcMain } from "electron";
import SpotifyAuth from "./src/api/spotify-auth";
import spotify from "./src/api/spotify";
import settings from "electron-settings";

settings.configure({ fileName: "selenite-settings.json", prettify: true });

let mainWindow: BrowserWindow;

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

app.whenReady().then(async () => {
  if(!settings.getSync('token.access')){
    const authWindow = new BrowserWindow();
    const spotyAuth = new SpotifyAuth(authWindow);
    spotyAuth.authenticate();
    authWindow.on('close', () => { createMainWindow(); });
  } else {
    createMainWindow();
  };
});

ipcMain.on('get-data', async (event) => {
  const data = await spotify.getPlayback();
  event.reply('new-data', data);
});