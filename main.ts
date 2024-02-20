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

function startApp(auth: SpotifyAuth) {
  createMainWindow();
  setInterval(auth.getRefreshToken, 60 * 59 * 1000);
};

ipcMain.on('get-data', async (event) => {
  const data = await spotify.getPlayback();
  if(data){
    event.reply('new-data', data);
  };
});

ipcMain.on('play', async () => {
  await spotify.resumePlayback();
});

ipcMain.on('pause', async () => {
  await spotify.pausePlayback();
});

ipcMain.on('next-song', async () => {
  await spotify.skipToNext();
});

ipcMain.on('previous-song', async () => {
  await spotify.skipToPrevious();
});

ipcMain.on('shuffle', async (e, state: boolean) => {
  await spotify.shuffle(state);
});

ipcMain.on('repeat', async (e, state: string) => {
  await spotify.repeat(state);
});

ipcMain.on("seek", async (e, timestamp: string) => {
  await spotify.seek(timestamp);
});

ipcMain.on("save-item", async (e, data: { playingType: string, id: string }) => {
  const {playingType, id} = data;
  await spotify.saveItem(playingType, id);
});

ipcMain.on("remove-item", async (e, data: { playingType: string, id: string }) => {
  const {playingType, id} = data;
  await spotify.removeItem(playingType, id);
});