import './Details.css';
import { useEffect, useState } from 'react';
const { ipcRenderer } = window.require('electron');

const sampleData = [{
    img: "../assets/pfp.png",
    title: "A Message to Myself - Mahogany Sessions",
    artist: "Roo Panes",
    duration: 180000+25000
  },
  {
    img: "../assets/pfp.png",
    title: "This Too Shall Pass",
    artist: "Parables and Primes",
    duration: 290000+25000
  }
]

const ListItem = ({track, num, playbackTrack}: any) => {
  const time = new Date(track.duration_ms);
  const seconds = time.getSeconds();
  const artists = track.artists.map((artist: any) => artist.name)
  const isPlaying = playbackTrack === track.uri;

  return (
    <div className={`details-table-item ${isPlaying ? 'current' : ''}`}>
      <p className='details-list-number'>
        { isPlaying 
          ? <i className='fa fa-volume-up'></i>
          : num
        }
      </p>
      <p 
        className='details-list-title' 
      >
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
    total: 0
  });
  const [playbackTrack, setPlaybackTrack] = useState()

  const [tracks, setTracks] = useState<any[]>([]);

  useEffect(() => {
    ipcRenderer.send('get-details');
    
    ipcRenderer.on('update-details', (e, data) => {
      const {tracks, ...details} = data;
      setDetails(details);
      setTracks(tracks);
    });

    ipcRenderer.on("new-playback-context", (e, uri) => {
      setPlaybackTrack(uri);
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
        <div id="details-table-header">
          <p className='details-list-number'>#</p>
          <p className='details-list-title'>Title</p>
          <p className='details-list-artist'>Artist</p>
          <p className='details-list-duration'><i className='fa fa-clock-o'/></p>
        </div>
        {tracks?.map((item: any, i: number) => 
          <ListItem 
            key={i} 
            track={item.track} 
            num={i+1} 
            playbackTrack={playbackTrack}
          />
        )}
      </div>
    </div>
  )
};

export default Details;