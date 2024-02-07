import { useState } from 'react';
import './App.css';
import AlbumCover from './components/AlbumCover';
import SongInfo from './components/SongInfo';
import Controls from './components/Controls';

function App() {
  const [title, setTitle] = useState("Hey there!  Play something on Spotify to start");
  const [img, setImg] = useState( "./assets/pfp.png");
  const [artist, setArtist] = useState("Play something on Spotify to start");

  const seek = () => {

  };

  return (
    <div id="player" className="electron-window one">
      <span className="menu">
        <i className="fa fa-list"></i>
      </span>
      <div className="draggable drag-container"></div>
      <div className="data-wrapper">
        <AlbumCover imgSrc={img} />
        <div className="info-wrapper">
          <SongInfo artist={artist} title={title} />
          <input 
            id="time-range" 
            className="time-range" 
            type="range" 
            value="0" 
            onChange={seek}
          />
          <Controls />
        </div>
      </div>
    </div>
  );
}

export default App;
