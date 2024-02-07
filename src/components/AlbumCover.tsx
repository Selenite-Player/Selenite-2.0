import './AlbumCover.css';

const AlbumCover = ({ imgSrc }: {imgSrc: string}): JSX.Element => {
  const saveSong = () => {

  };

  return (
    <div id="cover-wrapper" className="draggable">
      <i id="like-button" className="fa fa-heart-o outline" onClick={saveSong} style={{ display: "none" }}></i>
      <i id="liked-icon" className="fa fa-heart full" onClick={saveSong} style={{ display: "none" }}></i>
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