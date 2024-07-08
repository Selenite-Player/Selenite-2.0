import { ipcMain } from "electron";
import spotify from "../api/spotify";
import settings from "electron-settings";

const mainWindowEvents = () => {
  /* ipcMain.on('get-data', async (event) => {
    const data = await spotify.getPlayback();
    if(data){
      event.reply('new-data', data);
    };
  }); */
  
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
  
  ipcMain.on("get-devices", async (event) => {
    const devices = await spotify.getDevices();
    const activeDevice = devices.find(device => device.is_active);
  
    if(activeDevice){
      settings.setSync({
        ...settings.getSync(),
        device_id: activeDevice.id
      });
    }
    event.reply('update-devices', devices);
  });
  
  ipcMain.on("change-device", async (e, id: string) => {
    await spotify.transferPlayback(id);
  });
};

export default mainWindowEvents;