import { useEffect, useRef, useState } from 'react';
import Tracklist from './Tracklist';
const { ipcRenderer } = window.require('electron');

const SavedSongs = (playbackContext: {trackUri: string, context: { type: string, uri: string }}) => {
  const [tracks, setTracks] = useState([] as any[]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const listContainer = useRef<any>(null);

  let lastScrollTop = 0;

  useEffect(() => {
    ipcRenderer.send('get-saved-songs');
    ipcRenderer.on('update-saved-songs', (e, data) => {
      setTracks(data.items);
      setNextUrl(data.next);
    });
    ipcRenderer.on('next-saved-songs', (e, data) => {
      setTracks(tracks => {
        return[...tracks, ...data.items]});
      setNextUrl(data.next);
    });
  }, []);

  const getMore = () => {
    if(!nextUrl) return;

    const scrollTop = listContainer.current.scrollTop;

    if(scrollTop < lastScrollTop) return;

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

    if(scrollTop + listContainer.current.offsetHeight >= listContainer.current.scrollHeight-1 ) {
      ipcRenderer.send("get-next-saved-songs", nextUrl);
    };
  };

  return (
    <div 
      id="browse-content"
      ref={listContainer}
      onScroll={getMore}
    >
      <div id="saved-songs">
        <Tracklist tracks={tracks} context={playbackContext} />
      </div>
    </div>
  )
};

export default SavedSongs;