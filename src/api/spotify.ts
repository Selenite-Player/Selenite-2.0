import fetch from "node-fetch";
import settings from "electron-settings";

const fetchWithBearer = (url: string, payload: any) => {
  return fetch(url, {
    ...payload,
    headers: { Authorization: "Bearer " + settings.getSync("token.access") },
  }).catch(err => console.error(err));
};

const getPlayback = async () => {
  const res: any = await fetchWithBearer("https://api.spotify.com/v1/me/player?additional_types=episode", { method: "GET" });

  if (res.status === 204) {
    console.log('Playback not available or inactive');
    return null
  };

  const data = await res.json();

  if (data.error) {
    return console.log(data.error.status, data.error.message);
  };

  const playingType = data.currently_playing_type;

  if (playingType === "track") {
    const artists = data.item.artists.map((artist: any) => artist.name);

    return {
      id: data.item.id,
      playingType: playingType,
      title: data.item.name,
      artist: artists.join(", "),
      img: data.item.album.images[0].url,
      isSaved: await isSaved(playingType, data.item.id),
      isPlaying: data.is_playing,
      shuffleState: data.shuffle_state,
      repeatState: data.repeat_state,
      progress: data.progress_ms,
      duration: data.item.duration_ms,
    };
  } else if (playingType === "episode") {
    return {
      id: data.item.id,
      playingType: playingType,
      title: data.item.name,
      artist: data.item.show.name,
      img: data.item.images[0].url,
      isSaved: await isSaved(playingType, data.item.id),
      isPlaying: data.is_playing,
      shuffleState: data.shuffle_state,
      repeatState: data.repeat_state,
      progress: data.progress_ms,
      duration: data.item.duration_ms,
    };
  }
};

const getDevices = async (): Promise<any[]> => {
  const res = await fetchWithBearer("https://api.spotify.com/v1/me/player/devices", { method: "GET"})
  const data = await res!.json()
  return data.devices;
};

const transferPlayback = async (id: string) => {
  const res = await fetchWithBearer(
    "https://api.spotify.com/v1/me/player",
    { 
      method: "PUT",
      body: JSON.stringify({ device_ids: [id] })
    }
  );

  if(res!.status === 200){
    settings.setSync({
      ...settings.getSync(),
      device_id: id
    });
  };
};

const resumePlayback = async () => {
  const deviceId = settings.getSync('device_id');
  const url = deviceId 
    ? `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`
    : "https://api.spotify.com/v1/me/player/play"
    
  await fetchWithBearer(url, { method: 'PUT' });
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
    `https://api.spotify.com/v1/me/player/shuffle?state=${state.toString()}`,
    { method: 'PUT' }
  );
};

const repeat = async (state: string) => {
  await fetchWithBearer(
    `https://api.spotify.com/v1/me/player/repeat?state=${state}`,
    { method: 'PUT' }
  );
};

const seek = async (timestamp: string) => {
  await fetchWithBearer(
    `https://api.spotify.com/v1/me/player/seek?position_ms=${timestamp}`,
    { method: 'PUT' }
  );
};

const saveItem = async (type: string, id: string) => {
  await fetchWithBearer(
    `https://api.spotify.com/v1/me/${type}s?ids=${id}`,
    { method: 'PUT' }
  );
};

const removeItem = async (type: string, id: string) => {
  await fetchWithBearer(
    `https://api.spotify.com/v1/me/${type}s?ids=${id}`, 
    { method: 'DELETE' }
  );
};

const isSaved = async (type: string, id: string) => {
  const res = await fetchWithBearer(
    `https://api.spotify.com/v1/me/${type}s/contains?ids=${id}`,
    { method: 'GET' }
  );

  if (!res) {
    return
  };

  const isSaved = await res.json();
  return isSaved[0];
};

const getPlaylists = async () => {
  const res = await fetchWithBearer(
    "https://api.spotify.com/v1/me/playlists?limit=50",
    { method: 'GET' }
  );

  if (!res) { return; };

  const lists = await res.json();

  return lists.items.map((item: any) => ({
    title: item.name,
    owner: item.owner.display_name,
    id: item.id,
    /* link: item.href, */
    songs: item.tracks.total,
    img: item.images
  }));
};

const spotify = {
  transferPlayback,
  getPlayback,
  getDevices,
  resumePlayback,
  pausePlayback,
  skipToNext,
  skipToPrevious,
  shuffle,
  repeat,
  seek,
  saveItem,
  removeItem,
  isSaved,
  getPlaylists
};

export default spotify;