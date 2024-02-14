import fetch from "node-fetch";
import settings from "electron-settings";

const getPlayback = async () => {
  const res: any = await fetch("https://api.spotify.com/v1/me/player", {
    method: "GET",
    headers: { Authorization: "Bearer " + settings.getSync("token.access") },
  });

  if(res.status === 204){
    return console.log('Playback not available or inactive');
  };

  const data = await res.json();

  if(data.error){
    return console.log(data.error.status, data.error.message);
  };
  
  return data;
};

const spotify = { getPlayback };

export default spotify;