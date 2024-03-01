import './Playlists.css';
import { useState, useEffect } from 'react';
const { ipcRenderer } = window.require('electron');

type PlaylistInfo = {
  img: any[],
  id: string,
  title: string,
  owner: string | null,
  songs: number,
  uri: string,
  href: string
};

type PlaybackContext = {
  type: string,
  uri: string
};

const PlayListItem = ({playlist, context}: {playlist: PlaylistInfo, context: PlaybackContext}) => {
  if(!playlist) { return null };

  const img = playlist.img[0];

  const startPlaylist = () => {
    ipcRenderer.send('start-playlist', playlist.uri);
  };

  const openPlaylist = () => {
    ipcRenderer.send('open-playlist', playlist.href);
  };

  return (
    <div className="playlist-item" onClick={openPlaylist}>
      <div className="playlist-item-content">
        <div className="img-container">
          <img 
            src={img ? img.url : "../assets/pfp.png"} 
            alt="playlist cover" 
            className={playlist.uri === context.uri ? 'active' : ''}/>
          <i 
            className='fa fa-volume-up'
          />
          <i 
            className='fa fa-play'
            onClick={startPlaylist}
          />
        </div>
        <div className="details">
          <div className='playlist-title'>{playlist.title}</div>
          <span className="flex-row">
            <p className="playlist-creator">{ playlist.owner ? "by " + playlist.owner : '' }</p>
            <p className="song-number">{playlist.songs} songs</p>
          </span>
        </div>
      </div>
    </div>
  )
};

const Playlists = ({playbackContext}:{playbackContext: PlaybackContext}) => {
  const [playlists, setPlaylists] = useState<PlaylistInfo[]>([]);

  useEffect(() => {
    ipcRenderer.send('get-playlists');
    ipcRenderer.on('update-playlists', (e, playlists) => {
      setPlaylists(playlists);
    });
  }, []);

  return (
    <>
      {playlists.map(((playlist: PlaylistInfo) => 
        <PlayListItem key={playlist.id} playlist={playlist} context={playbackContext} />
      ))} 
    </>
  )
};

export default Playlists;