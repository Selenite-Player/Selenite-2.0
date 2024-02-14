import { app, BrowserWindow } from "electron";
import SpotifyAuth from "./src/api/spotify-auth";
import settings from "electron-settings";

settings.configure({ fileName: "selenite-settings.json", prettify: true });

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

  if(!settings.getSync('token.access')){
    const authWindow = new BrowserWindow();
    const spotyAuth = new SpotifyAuth(authWindow);
    spotyAuth.authenticate();
  };
});