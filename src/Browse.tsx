import './Browse.css';
import { useState, useEffect } from 'react';
import Playlists from './components/Playlists';
const { ipcRenderer } = window.require('electron');

/* const list: PlaylistInfo[] = [{
  img: [{url: "../assets/pfp.png"}],
  id: "1",
  title: "RUNNING REMIX OF DEATH FOR ALL PEOPLE WHO LIKE NORMAL SENTENCES AND FEEL HORROR BY SCREAMING WAAAAAAAAAAAY TOO LONG TITLE THAT ARE DANGEROUSLY LOOMING OVER ONES HEAD!!!!!!!",
  owner: "der längste name dem einem überhaupt nur einfallen kann",
  songs: 1009
},
{
  img: [{url: "../assets/pfp.png"}],
  id: "1",
  title: "RUNNING REMIX OF DEATH ",
  owner: "der längste name dem",
  songs: 1009
}] */

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