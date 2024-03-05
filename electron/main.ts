import { app, BrowserWindow, ipcMain } from "electron";
import SpotifyAuth from "./api/spotify-auth";
import settings from "electron-settings";
import mainWindowEvents from "./events/mainWindow";
import browseWindowEvents from "./events/browseWindow";
import spotify from "./api/spotify";

settings.configure({ fileName: "selenite-settings.json", prettify: true });

let mainWindow: BrowserWindow;
let browseWindow: BrowserWindow | null;
let detailsWindow: BrowserWindow | null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 465,
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
    height: 505,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    transparent: true,
    frame: false,
    title: "Browse",
    hasShadow: false,
  });

  const pos = mainWindow.getPosition();
  browseWindow.setPosition(pos[0]+475, pos[1]);

  browseWindow.loadURL('http://localhost:3000/index.html/browse');
};

function createDetailsWindow() {
  detailsWindow = new BrowserWindow({
    width: 465,
    height: 345,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    transparent: true,
    frame: false,
    title: "Details",
    hasShadow: false,
  });

  const pos = mainWindow.getPosition();
  detailsWindow.setPosition(pos[0], pos[1]+160);

  detailsWindow.loadURL('http://localhost:3000/index.html/details');
};

function startApp(auth: SpotifyAuth) {
  createMainWindow();
  setInterval(() => auth.getRefreshToken(), 60 * 59 * 1000);
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

ipcMain.on('open-details', async (e, id) => {
  if(detailsWindow){
    const data = await spotify.getPlaylist(id);
    detailsWindow.webContents.send('update-details', data);
    return;
  }

  createDetailsWindow();

  ipcMain.on('get-details', async (event) => {
    const data = await spotify.getPlaylist(id);
    event.reply('update-details', data);
  });
});

ipcMain.on('close-details',() => {
  detailsWindow!.close();
  detailsWindow = null;
});

ipcMain.on("update-playback-context", (e, {trackUri, context}) => {
  detailsWindow?.webContents.send("new-playback-context", trackUri);
  browseWindow?.webContents.send("new-playback-context", { trackUri, context });
});

ipcMain.on("play-song", (e, {contextUri, position}) => {
  spotify.playSong(contextUri, position);
});

ipcMain.on('get-saved-songs', async (event) => {
  const songs = await spotify.getSavedSongs();
  event.reply('update-saved-songs', songs);
});

ipcMain.on('get-next-saved-songs', async (event, url) => {
  const data = await spotify.getNextSavedSongs(url);
  event.reply('next-saved-songs', data);
});

browseWindowEvents();