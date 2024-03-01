import { app, BrowserWindow, ipcMain } from "electron";
import SpotifyAuth from "../src/api/spotify-auth";
import settings from "electron-settings";
import mainWindowEvents from "./events/mainWindow";
import browseWindowEvents from "./events/brwoseWindow";
import spotify from "../src/api/spotify";

settings.configure({ fileName: "selenite-settings.json", prettify: true });

let mainWindow: BrowserWindow;
let browseWindow: BrowserWindow | null;

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

  if (settings.getSync("window-position")) {
    const [x, y] = settings.getSync("window-position") as number[];
    mainWindow.setPosition(x, y);
  };

  mainWindow.loadURL('http://localhost:3000/index.html');
};

function createBrowseWindow() {
  browseWindow = new BrowserWindow({
    width: 380,
    height: 510,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    transparent: true,
    frame: false,
    title: "Brwose",
    hasShadow: false,
  });

  const pos = mainWindow.getPosition();
  browseWindow.setPosition(pos[0]+470, pos[1]);

  browseWindow.loadURL('http://localhost:3000/index.html/browse');
};

function startApp(auth: SpotifyAuth) {
  createMainWindow();
  setInterval(auth.getRefreshToken, 60 * 59 * 1000);
};

app.whenReady().then(async () => {
  const spotyAuth = new SpotifyAuth();

  if(!settings.getSync('token.refresh')){
    const authWindow = new BrowserWindow();
    spotyAuth.authenticate(authWindow);
    authWindow.on('close', () => { startApp(spotyAuth); });
  } else {
    await spotyAuth.getRefreshToken();
    startApp(spotyAuth);
  };
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if(!mainWindow){ return; };
  settings.setSync("window-position", mainWindow.getPosition());
});

mainWindowEvents();

ipcMain.on('get-data', async (event) => {
  const data = await spotify.getPlayback();

  if(data){
    event.reply('new-data', data);
    browseWindow?.webContents.send('update-context', data.context);
  };
});

ipcMain.on('open-browse',() => {
  if(!browseWindow){ 
    createBrowseWindow();
  };
});

ipcMain.on('close-browse',() => {
  browseWindow!.close();
  browseWindow = null;
});

browseWindowEvents();