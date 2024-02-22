import { ipcMain } from "electron";
import spotify from "../../src/api/spotify";

const browseWindowEvents = () => {
  ipcMain.on('get-playlists', async (event) => {
    const playlists = await spotify.getPlaylists();
    event.reply('update-playlists', playlists);
  });
};

export default browseWindowEvents;
