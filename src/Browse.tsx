import './Browse.css';
import { useEffect, useState } from 'react';
import Playlists from './components/Playlists';
import SavedSongs from './components/SavedSongs';
const { ipcRenderer } = window.require('electron');

type NavItemProps = {
  isActive: boolean, 
  item: string, 
  handleClick: () => void
}

const NavItem = ({isActive, item, handleClick}: NavItemProps) => {
  return <li className={isActive ? 'active' : ''} onClick={handleClick}>{item}</li>;
};

const Browse = () => {
  const [navItem, setNavItem] = useState("Playlists");
  const [playbackContext, setPlaybackContext] = useState({ trackUri: "", context: { type: "", uri: "" } });

  useEffect(() => {
    ipcRenderer.on('update-context', (e, context) => {
      setPlaybackContext(context);
    })
  },[]);

  const closeBrowse = () => {
    ipcRenderer.send('close-browse');
  };

  const renderContent = (key: string) => {
    switch (key) {
      case "Playlists":
        return <Playlists playbackContext={playbackContext.context} />
      case "Liked Songs":
        return <SavedSongs {...playbackContext} />
      default:
        return <div></div>
    }
  };

  const navOptions = [
    "Playlists", "Liked Songs", "Podcasts"
  ];

  return (
    <div id="browse-window">
      <div id="browse-nav-bar">
        <i 
          className="fa fa-times-circle"
          onClick={closeBrowse}
        />
        <ul id="browse-nav-items">
          {navOptions.map((item: string) => 
            <NavItem 
              isActive={navItem === item} 
              item={item} 
              handleClick={() => setNavItem(item)}
            />
          )}
        </ul>
      </div>
      {renderContent(navItem)}
    </div>
  )
};

export default Browse;