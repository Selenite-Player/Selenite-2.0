import { useEffect, useState } from 'react';
import './Browse.css';
import Playlists from './components/Playlists';
const { ipcRenderer } = window.require('electron');

const Browse = () => {
  const [playbackContext, setPlaybackContext] = useState({type: "", uri: ""});

  useEffect(() => {
    ipcRenderer.on('update-context', (e, context) => {
      setPlaybackContext(context);
    })
  },[]);

  const closerBrowse = () => {
    ipcRenderer.send('close-browse');
  };

  return (
    <div id="browse-window">
      <div id="browse-menu-bar">
        <i 
          className="fa fa-times-circle"
          onClick={closerBrowse}
        />
        <ul id="browse-menu-items">
          <li className='active'>Playlists</li>
          <li>Queue</li>
          <li>Liked Songs</li>
          <li>Podcasts</li>
        </ul>
      </div>
      <div id="browse-content">
        <Playlists playbackContext={playbackContext} />
      </div>
    </div>
  )
};

export default Browse;