import './Player.css';
import { useEffect, useState, useContext } from 'react';
import { PlaybackDispatchContext } from './PlaybackContext';
import AlbumCover from './components/AlbumCover';
import SongInfo from './components/SongInfo';
import TimeRange from './components/TimeRange';
import Controls from './components/Controls';
import Devices from './components/Devices';
const { ipcRenderer } = window.require('electron');

const Player = () => {
  const [showDevices, setShowDevices] = useState(false);
  const dispatch = useContext(PlaybackDispatchContext);

  useEffect(() => {
    setInterval(() => ipcRenderer.send("get-data"), 1000);

    ipcRenderer.on("new-data", (e, data) => {
      dispatch({ type: 'update', playback: data });
    });
  }, []); // eslint-disable-line

  const openBrowse = () => {
    ipcRenderer.send("open-browse");
  };

  return (
    <div id="player" className="electron-window one">
      <span className="menu">
        <i 
          className="fa fa-list"
          onClick={openBrowse} >
        </i>
      </span>
      <div className="drag-container"></div>
      <div className="data-wrapper">
        <AlbumCover />
        <div className="info-wrapper">
          <SongInfo />
          <TimeRange />
          {showDevices && <Devices show={showDevices} setShowDevices={setShowDevices} />}
          <Controls setShowDevices={setShowDevices} showDevices={showDevices} />
        </div>
      </div>
    </div>
  );
};

export default Player;
