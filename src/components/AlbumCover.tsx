import './AlbumCover.css';
const { ipcRenderer } = window.require('electron');

type CoverProps = {
  imgSrc: string, 
  isSaved: boolean | null,
  id: string
};

const AlbumCover = ({ imgSrc, isSaved, id }: CoverProps): JSX.Element => {
  const saveSong = () => {
    const message = isSaved ? "remove-song" : "save-song";
    console.log(id)
    ipcRenderer.send(message, id);
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
        src={imgSrc}
      />
    </div>
  )
};

export default AlbumCover;