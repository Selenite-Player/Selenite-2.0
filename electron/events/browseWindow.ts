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

  ipcMain.on('get-next-playlists', async (event, url) => {
    const data = await spotify.getNext(url);
    const playlists = data.items.map((item: any) => ({
      title: item.name,
      owner: item.owner.display_name,
      id: item.id,
      uri: item.uri,
      songs: item.tracks.total,
      img: item.images,
      href: item.tracks.href
    }));
  
    const lists = {
      nextUrl: data.next,
      playlists
    };

    event.reply('next-playlists', lists);
  });
};

export default browseWindowEvents;
