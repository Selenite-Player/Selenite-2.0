import { ipcMain } from "electron";
import spotify from "../api/spotify";

const browseWindowEvents = () => {
  ipcMain.on('get-playlists', async (event) => {
    const playlists = await spotify.getPlaylists();
    event.reply('update-playlists', playlists);
  });

  ipcMain.on('start-playlist', (e, uri) => {
    spotify.startPlaylist(uri);
  });
};

export default browseWindowEvents;
