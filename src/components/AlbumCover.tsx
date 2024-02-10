import './AlbumCover.css';
const { ipcRenderer } = window.require('electron');

const AlbumCover = ({ imgSrc, isSaved }: {imgSrc: string, isSaved: boolean | null}): JSX.Element => {
  const saveSong = () => {
    ipcRenderer.send('save-song');
  };

  return (
    <div id="cover-wrapper" className="draggable">
      <i 
        id="like-button" 
        aria-label="save-song" 
        className={`fa ${isSaved ? "fa-heart full" : "fa-heart-o outline"}`} 
        onClick={saveSong} 
        style={{ display: isSaved !== null ? "display" : "none"}}></i>
      <img 
        alt=""
        draggable="false"
        id="cover"
        className="cover box-shadow"
        src={imgSrc}
      />
    </div>
  )
};

export default AlbumCover;