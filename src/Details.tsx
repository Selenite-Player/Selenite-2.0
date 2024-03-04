import './Details.css';
import { useEffect, useState } from 'react';
const { ipcRenderer } = window.require('electron');

const ListItem = ({track, pos, playbackContext, listUri}: any) => {
  const time = new Date(track.duration_ms);
  const seconds = time.getSeconds();
  const artists = track.artists.map((artist: any) => artist.name);
  const isPlaying = playbackContext === track.uri;

  const playSong = () => {
    ipcRenderer.send('play-song', {contextUri: listUri, position: pos-1});
  };

  return (
    <div 
      className={`details-list-item ${isPlaying ? 'current' : ''}`}
      onClick={playSong}
    >
      <p className='details-list-number'>
        { isPlaying 
          ? <i className='fa fa-volume-up'></i>
          : pos
        }
      </p>
      <p className='details-list-title' >
        <img src={track.album.images[0].url} alt="" />
        {track.name}
      </p>
      <p className='details-list-artist'>{artists.join(', ')}</p>
      <p className='details-list-duration'>{`${time.getMinutes()}:${seconds < 10 ? "0" + seconds : seconds}`}</p>
    </div>
  )
};

const Details = () => {
  const [details, setDetails] = useState<any>({
    title: "",
    img: ["../assets/pfp.png"],
    total: 0,
    uri: ""
  });
  const [playbackContext, setPlaybackContext] = useState()
  const [tracks, setTracks] = useState<any[]>([]);

  useEffect(() => {
    ipcRenderer.send('get-details');
    
    ipcRenderer.on('update-details', (e, data) => {
      const {tracks, ...details} = data;
      setDetails(details);
      setTracks(tracks);
    });

    ipcRenderer.on("new-playback-context", (e, trackUri) => {
      setPlaybackContext(trackUri);
    });
  },[]);

  const closeDetails = () => {
    ipcRenderer.send('close-details');
  };

  return (
    <div id="details-window">
      <div id="title-wrapper">
        <i 
          className="fa fa-times-circle"
          onClick={closeDetails}
        />
        <img src={details.img[0].url} alt="" />
        <div id="title-text">
          <p id="details-title">{details.title}</p>
          <p id="details-info">{details.total + " songs"}</p>
        </div>
      </div>
      <div id="details-content">
        <div id="details-list-header">
          <p className='details-list-number'>#</p>
          <p className='details-list-title'>Title</p>
          <p className='details-list-artist'>Artist</p>
          <p className='details-list-duration'><i className='fa fa-clock-o'/></p>
        </div>
        {tracks?.map((item: any, i: number) => 
          <ListItem 
            key={i} 
            track={item.track} 
            pos={i+1} 
            playbackContext={playbackContext}
            listUri={details.uri}
          />
        )}
      </div>
    </div>
  )
};

export default Details;