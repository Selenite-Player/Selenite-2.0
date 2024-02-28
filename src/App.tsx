import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { useReducer } from 'react';
import { PlaybackContext, PlaybackDispatchContext } from './PlaybackContext';
import Player from './Player';
import Browse from './Browse';

const router = createBrowserRouter([
  {
    path: "/index.html",
    element: <Player />,
  },
  {
    path: "/index.html/browse",
    element: <Browse />,
  },
]);

type PlaybackData = {
  id: string,
  playingType: string,
  title: string,
  img: string,
  artist: string,
  isSaved: boolean | null,
  isPlaying: boolean,
  shuffleState: boolean,
  repeatState: string,
  progress: number,
  duration: number
}

function playbackReducer(playback: PlaybackData, action: any) {
  switch (action.type) {
    case 'update': {
      return {...action.playback};
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialState = {
  id: "",
  playingType: "",
  title: "Hey there!",
  img: "./assets/pfp.png",
  artist: "Play something on Spotify to start",
  isSaved: null,
  isPlaying: false,
  shuffleState: false,
  repeatState: "off",
  progress: 0,
  duration:100
};

function App() {
  const [playback, dispatch] = useReducer(playbackReducer, initialState);

  return (
    <PlaybackContext.Provider value={playback}>
      <PlaybackDispatchContext.Provider value={dispatch}>
        <RouterProvider router={router} />
      </PlaybackDispatchContext.Provider>
    </PlaybackContext.Provider>
  );
};

export default App;
