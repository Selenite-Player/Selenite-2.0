import { useEffect, useState } from 'react';
import './App.css';
import AlbumCover from './components/AlbumCover';
import SongInfo from './components/SongInfo';
import TimeRange from './components/TimeRange';
import Controls from './components/Controls';
import Devices from './components/Devices';
const { ipcRenderer } = window.require('electron');

function App() {
  const [id, setId] = useState("");
  const [playingType, setPlayingType] = useState("");
  const [title, setTitle] = useState("Hey there!");
  const [img, setImg] = useState( "./assets/pfp.png");
  const [artist, setArtist] = useState("Play something on Spotify to start");
  const [isSaved, setIsSaved] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffleState, setShuffleState] = useState(false);
  const [repeatState, setRepeatState] = useState("off");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(100);
  const [showDevices, setShowDevices] = useState(false);

  useEffect(() => {
    setInterval(() => ipcRenderer.send("get-data"), 1000);

    ipcRenderer.on("new-data", (e, data) => {
      setId(data.id);
      setPlayingType(data.playingType);
      setTitle(data.title);
      setImg(data.img);
      setArtist(data.artist);
      setIsPlaying(data.isPlaying);
      setShuffleState(data.shuffleState);
      setRepeatState(data.repeatState);
      setProgress(data.progress);
      setDuration(data.duration);
      setIsSaved(data.isSaved);
    });
  }, []);

  return (
    <div id="player" className="electron-window one">
      <span className="menu">
        <i className="fa fa-list"></i>
      </span>
      <div className="drag-container"></div>
      <div className="data-wrapper">
        <AlbumCover imgSrc={img} isSaved={isSaved} id={id} playingType={playingType} />
        <div className="info-wrapper">
          <SongInfo artist={artist} title={title} />
          <TimeRange progress={progress} duration={duration} />
          <Devices show={showDevices} setShowDevices={setShowDevices} />
          <Controls 
            repeatState={repeatState} 
            shuffleState={shuffleState} 
            isPlaying={isPlaying}
            setShowDevices={setShowDevices}
            showDevices={showDevices} />
        </div>
      </div>
    </div>
  );
};

export default App;
