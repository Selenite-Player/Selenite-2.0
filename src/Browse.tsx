import './Browse.css';
import { useState, useEffect } from 'react';
import Playlists from './components/Playlists';
const { ipcRenderer } = window.require('electron');

const Browse = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    ipcRenderer.send('get-playlists');
    ipcRenderer.on('update-playlists', (e, playlists) => {
      setPlaylists(playlists);
    });
  }, []);

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
        <Playlists playlists={playlists} />
      </div>
    </div>
  )
};

export default Browse;