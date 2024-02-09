import { useState } from 'react';
import './App.css';
import AlbumCover from './components/AlbumCover';
import SongInfo from './components/SongInfo';
import TimeRange from './components/TimeRange';
import Controls from './components/Controls';

function App() {
  const [title, setTitle] = useState("Hey there!");
  const [img, setImg] = useState( "./assets/pfp.png");
  const [artist, setArtist] = useState("Play something on Spotify to start");
  const [isSaved, setIsSaved] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffleState, setShuffleState] = useState(false);
  const [repeatState, setRepeatState] = useState("off");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(100);

  return (
    <div id="player" className="electron-window one">
      <span className="menu">
        <i className="fa fa-list"></i>
      </span>
      <div className="draggable drag-container"></div>
      <div className="data-wrapper">
        <AlbumCover imgSrc={img} isSaved={isSaved} />
        <div className="info-wrapper">
          <SongInfo artist={artist} title={title} />
          <TimeRange progress={progress} duration={duration} />
          <Controls 
            repeatState={repeatState} 
            shuffleState={shuffleState} 
            isPlaying={isPlaying} />
        </div>
      </div>
    </div>
  );
}

export default App;
