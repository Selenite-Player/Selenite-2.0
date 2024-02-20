import fetch from "node-fetch";
import settings from "electron-settings";

const fetchWithBearer = (url: string, payload: any) => {
  return fetch(url, {
    ...payload,
    headers: { Authorization: "Bearer " + settings.getSync("token.access") },
  }).catch(err => console.error(err));
};

const getPlayback = async () => {
  const res: any = await fetchWithBearer("https://api.spotify.com/v1/me/player", { method: "GET" });

  if(res.status === 204){
    return console.log('Playback not available or inactive');
  };

  const data = await res.json();

  if(data.error){
    return console.log(data.error.status, data.error.message);
  };
  
  return {
    id: data.item.id,
    title: data.item.name,
    artist: data.item.artists.map((artist: any) => artist.name),
    img: data.item.album.images[0].url,
    isSaved: await isSaved(data.item.id),
    isPlaying: data.is_playing,
    shuffleState: data.shuffle_state,
    repeatState: data.repeat_state,
    progress: data.progress_ms,
    duration: data.item.duration_ms,
  };
};

const resumePlayback = async () => {
  await fetchWithBearer("https://api.spotify.com/v1/me/player/play", { method: 'PUT' });
};

const pausePlayback = async () => {
  await fetchWithBearer("https://api.spotify.com/v1/me/player/pause", { method: 'PUT' });
};

const skipToNext = async () => {
  await fetchWithBearer("https://api.spotify.com/v1/me/player/next", { method: 'POST' });
};

const skipToPrevious = async () => {
  await fetchWithBearer("https://api.spotify.com/v1/me/player/previous", { method: 'POST' });
};

const shuffle = async (state: boolean) => {
  await fetchWithBearer(
    `https://api.spotify.com/v1/me/player/shuffle?state=${state.toString()}`
    , { method: 'PUT' }
  );
};

const repeat = async (state: string) => {
  await fetchWithBearer(
    `https://api.spotify.com/v1/me/player/repeat?state=${state}`
    , { method: 'PUT' }
  );
};

const saveSong = async (id: string) => {
  await fetchWithBearer(
    `https://api.spotify.com/v1/me/tracks?ids=${id}`
    , { method: 'PUT' }
  );
};

const removeSong = async (id: string) => {
  await fetchWithBearer(
    `https://api.spotify.com/v1/me/tracks?ids=${id}`
    , { method: 'DELETE' }
  );
};

const isSaved = async (id: string) => {
  const res = await fetchWithBearer(
    `https://api.spotify.com/v1/me/tracks/contains?ids=${id}`,
    { method: 'GET' }
  );

  if(!res){
   return 
  };

  const isSaved = await res.json();
  return isSaved[0];
};

const spotify = { 
  getPlayback, 
  resumePlayback,
  pausePlayback,
  skipToNext,
  skipToPrevious,
  shuffle,
  repeat,
  saveSong,
  removeSong,
  isSaved
};

export default spotify;