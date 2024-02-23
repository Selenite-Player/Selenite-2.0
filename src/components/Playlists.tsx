import './Playlists.css';
const { ipcRenderer } = window.require('electron');

type PlaylistInfo = {
  img: any[],
  id: string,
  title: string,
  owner: string | null,
  songs: number,
  uri: string
};

const PlayListItem = (props: PlaylistInfo) => {
  if(props.songs <= 0) { return null };

  const img = props.img[0];

  const startPlaylist = () => {
    ipcRenderer.send('start-playlist', props.uri);
  };

  return (
    <div className="playlist-item">
      <div className="playlist-item-content">
        <div className="img-container">
          <img src={img ? img.url : ''} alt="playlist cover" />
          <i 
            className='fa fa-play'
            onClick={startPlaylist}
          />
        </div>
        <div className="details">
          <div className='playlist-title'>{props.title}</div>
          <span className="flex-row">
            <p className="playlist-creator">{ props.owner ? "by " + props.owner : '' }</p>
            <p className="song-number">{props.songs} songs</p>
          </span>
        </div>
      </div>
    </div>
  )
};

const Playlists = ({playlists}: {playlists: PlaylistInfo[]}) => {
  return (
    <>
      { playlists.map(((playlist: PlaylistInfo) => 
        <PlayListItem key={playlist.id} {...playlist} />
      ))} 
    </>
  )
};

export default Playlists;