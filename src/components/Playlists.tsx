import './Playlists.css';
import { useState, useEffect, useRef } from 'react';
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

  const img = playlist.img ? playlist.img[0] : '';

  const startPlaylist = () => {
    ipcRenderer.send('start-playlist', playlist.uri);
  };

  const openDetails = () => {
    ipcRenderer.send('open-details', playlist.id);
  };

  return (
    <div className="playlist-item" >
      <div className="playlist-item-content">
        <div className="img-container">
          <img 
            src={img ? img.url : "../assets/pfp.png"} 
            alt="playlist cover" 
            className={playlist.uri === context.uri ? 'active' : ''}/>
          <i className='fa fa-volume-up' />
          <i 
            className='fa fa-play'
            onClick={startPlaylist}
          />
        </div>
        <div className="details" onClick={openDetails}>
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
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const container = useRef<any>(null);

  let lastScrollTop = 0;

  useEffect(() => {
    ipcRenderer.send('get-playlists');
    ipcRenderer.on('update-playlists', (e, data) => {
      const { nextUrl, playlists } = data;
      setPlaylists(playlists);
      setNextUrl(nextUrl);
    });
    ipcRenderer.on('next-playlists', (e, data) => {
      setPlaylists(playlists => {
        return[...playlists, ...data.playlists]});
      setNextUrl(data.nextUrl);
    });
  }, []);

  const getMore = () => {
    if(!nextUrl) return;

    const scrollTop = container.current.scrollTop;

    if(scrollTop < lastScrollTop) return;

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

    if(scrollTop + container.current.offsetHeight >= container.current.scrollHeight-1 ) {
      ipcRenderer.send("get-next-playlists", nextUrl);
    };
  };

  return (
    <div 
      id="browse-content" 
      ref={container}
      onScroll={getMore}
    >
      <div id="playlists" >
        {playlists.map(((playlist: PlaylistInfo) => 
          <PlayListItem key={playlist.id} playlist={playlist} context={playbackContext} />
        ))} 
      </div>
    </div>
  );
};

export default Playlists;