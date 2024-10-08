import './Tracklist.css'
const { ipcRenderer } = window.require('electron');

const ListItem = ({track, pos, playbackContext}: any) => {
  const time = new Date(track.duration_ms);
  const seconds = time.getSeconds();
  const artists = track.artists.map((artist: any) => artist.name);
  const { trackUri } = playbackContext;
  const isPlaying = trackUri === track.uri;

  const playSong = () => {
    ipcRenderer.send('play-song', { 
      contextUri: `spotify:user:${localStorage.getItem('user')}:collection`, 
      position: pos-1
    });
  };

  return (
    <div 
      className={`tracklist-item ${isPlaying ? 'current' : ''}`}
      onClick={playSong}
    >
      <p className='tracklist-number'>
        { isPlaying 
          ? <i className='fa fa-volume-up'></i>
          : pos
        }
      </p>
      <p className='tracklist-title' >
        <img src={track.album.images[0].url} alt="" />
        {track.name}
      </p>
      <p className='tracklist-artist'>{artists.join(', ')}</p>
      <p className='tracklist-duration'>{`${time.getMinutes()}:${seconds < 10 ? "0" + seconds : seconds}`}</p>
    </div>
  )
};

const Tracklist = ({ tracks, context }: { tracks: any[], context: any }) => {  
  return (
    <div className="tracklist" >
      <div id="tracklist-header">
        <p className='tracklist-number'>#</p>
        <p className='tracklist-title'>Title</p>
        <p className='tracklist-artist'>Artist</p>
        <p className='tracklist-duration'><i className='fa fa-clock-o'/></p>
      </div>
      <div className="tracklist-content">
        {tracks?.map((item: any, i: number) => 
          <ListItem 
            key={i} 
            track={item.track} 
            pos={i+1} 
            playbackContext={context}
          />
        )}
      </div>
    </div>
  )
}

export default Tracklist;