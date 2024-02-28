import './AlbumCover.css';
import { PlaybackContext} from '../PlaybackContext';
import { useContext } from 'react';
const { ipcRenderer } = window.require('electron');

const AlbumCover = (): JSX.Element => {
  const { img, isSaved, id, playingType } = useContext(PlaybackContext);

  const saveSong = () => {
    const message = isSaved ? "remove-item" : "save-item";
    ipcRenderer.send(message, { playingType, id });
  };

  return (
    <div id="cover-wrapper" className="draggable">
      <i 
        id="like-button" 
        aria-label="save-song" 
        className={`fa ${isSaved ? "fa-heart full" : "fa-heart-o outline"}`} 
        onClick={saveSong} 
        style={{ display: (isSaved == null) ? "none" : "block" }}></i>
      <img 
        alt=""
        draggable="false"
        id="cover"
        className="cover box-shadow"
        src={img}
      />
    </div>
  )
};

export default AlbumCover;