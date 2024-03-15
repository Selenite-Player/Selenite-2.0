import fetch from "node-fetch";
import settings from "electron-settings";
import { type PlaybackData } from "../../src/PlaybackContext";

const fetchWithBearer = (url: string, payload: any) => {
  return fetch(url, {
    ...payload,
    headers: { Authorization: "Bearer " + settings.getSync("token.access") },
  }).catch(err => console.error(err));
};

const getUsername = async () => {
  const res = await fetchWithBearer(
    `https://api.spotify.com/v1/me`,
    { method: 'GET' }
  );

  const data = await res!.json();

  const username = data.display_name;

  settings.setSync({
    ...settings.getSync(),
    username: username
  });
};

const getPlayback = async (): Promise<PlaybackData | void> => {
  const res: any = await fetchWithBearer("https://api.spotify.com/v1/me/player?additional_types=episode", { method: "GET" });

  if (res.status === 204) {
    /* console.log('Playback not available or inactive'); */
    return;
  };

  const data = await res.json();

  if (data.error) {
    return console.log(data.error);
  };

  const playingType = data.currently_playing_type;
  const context = data.context 
    ? {
        type: data.context.type,
        uri: data.context.uri
      }
    : undefined;

  if (playingType === "track") {
    const artists = data.item.artists.map((artist: any) => artist.name);

    return {
      id: data.item.id,
      uri: data.item.uri,
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
      context: context
    };
  } else if (playingType === "episode") {
    return {
      id: data.item.id,
      uri: data.item.uri,
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
      context: context
    };
  };
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
    uri: item.uri,
    songs: item.tracks.total,
    img: item.images,
    href: item.tracks.href
  }));
};

const getPlaylist = async (id: string) => {
  const res = await fetchWithBearer(
    `https://api.spotify.com/v1/playlists/${id}`,
    { method: 'GET' }
  );

  if (!res) { return; };

  const list = await res.json();

  return ({
    title: list.name,
    tracks: list.tracks.items,
    total: list.tracks.total,
    img: list.images,
    uri: list.uri
  });
};

const startPlaylist = async (uri: string) => {  
  await fetchWithBearer(
    `https://api.spotify.com/v1/me/player/play`,
    { 
      method: 'PUT',
      body: JSON.stringify({ "context_uri": uri})
    }
  );
};

const playSong = async (uri: string, position: number) => { 
  await fetchWithBearer(
    `https://api.spotify.com/v1/me/player/play`,
    { 
      method: 'PUT',
      body: JSON.stringify({ "context_uri": uri, "offset": {
        "position": position
      },})
    }
  );
};

const getSavedSongs = async () => {
  const res = await fetchWithBearer(
    `https://api.spotify.com/v1/me/tracks?limit=50`,
    { method: 'GET' }
  );

  const data = await res!.json();
  return data;
};

const getNextSavedSongs = async (url: string) => {
  const res = await fetchWithBearer(
    url,
    { method: 'GET' }
  );

  const data = await res!.json();
  return data;
};

const spotify = {
  getUsername,
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
  getPlaylists,
  getPlaylist,
  startPlaylist,
  playSong,
  getSavedSongs,
  getNextSavedSongs
};

export default spotify;