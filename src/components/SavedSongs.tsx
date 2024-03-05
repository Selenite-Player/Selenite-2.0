import { useEffect, useState } from 'react';
import Tracklist from './Tracklist';
const { ipcRenderer } = window.require('electron');

const SavedSongs = (playbackContext: {trackUri: string, context: { type: string, uri: string }}) => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    ipcRenderer.send('get-saved-songs');
    ipcRenderer.on('update-saved-songs', (e, data) => {
      setTracks(data.items);
    })
  }, []);

  return (
    <div id="saved-songs">
      <Tracklist tracks={tracks} context={playbackContext} />
    </div>
  )
};

export default SavedSongs;