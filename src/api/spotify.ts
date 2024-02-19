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
  
  return {
    title: data.item.name,
    artist: data.item.artists.map((artist: any) => artist.name),
    img: data.item.album.images[0].url,
    /* isSaved: , */
    isPlaying: data.is_playing,
    shuffleState: data.shuffle_state,
    repeatState: data.repeat_state,
    progress: data.progress_ms,
    duration: data.item.duration_ms,
  };
};

const spotify = { getPlayback };

export default spotify;