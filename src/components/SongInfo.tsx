import { useState, useContext } from 'react';
import { PlaybackContext } from '../PlaybackContext';
import './SongInfo.css';

const SongInfo = (): JSX.Element => {
  const {title, artist} = useContext(PlaybackContext);
  const [titleHover, setTitleHover] = useState(false);
  const [artistHover, setArtistHover] = useState(false);

  const addHover = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const scrollBox = e.currentTarget;
    const id = scrollBox.id;
    const span = scrollBox.firstChild! as HTMLSpanElement;

    if (span.offsetWidth <= scrollBox.offsetWidth) {
      return;
    }

    const transition = span.offsetWidth / 50 + "s";
    span.style.setProperty(
      "transition-duration",
      transition
    );

    switch (id) {
      case 'title-scroll-box':
        setTitleHover(true)
        break
      case 'artist-scroll-box':
        setArtistHover(true)
    }
  };

  const removeHover = (id: string) => {
    switch (id) {
      case 'title':
        setTitleHover(false)
        break
      case 'artist':
        setArtistHover(false)
    }
 };

  const titleStyle = {
    transform: titleHover ? 'translateX(calc(210px - 100%))' : ''
  }

  const artistStyle = {
    transform: artistHover ? 'translateX(calc(210px - 100%))' : ''
  }

  return(
    <div>
      <div 
        id="title-scroll-box" 
        className="scrollBox" 
        onMouseEnter={(e) => addHover(e)} 
        onMouseLeave={() => removeHover('title')}
      >
        <span id="song-title" className="song-title" style={titleStyle}>{title}</span>
      </div>
      <div 
        id="artist-scroll-box" 
        className="scrollBox" 
        onMouseEnter={(e) => addHover(e)} 
        onMouseLeave={() => removeHover('artist')}
      >
        <span className="artist" id="artist" style={artistStyle}>{artist}</span>
      </div>
    </div>
  )
};

export default SongInfo;