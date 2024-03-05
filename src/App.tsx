import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { useReducer } from 'react';
import { 
  PlaybackContext, 
  PlaybackDispatchContext, 
  type PlaybackData 
} from './PlaybackContext';
import Player from './Player';
import Browse from './Browse';
import Details from "./Details";

const router = createBrowserRouter([
  {
    path: "/index.html",
    element: <Player />,
  },
  {
    path: "/index.html/browse",
    element: <Browse />,
  },
  {
    path: "/index.html/details",
    element: <Details />,
  },
]);

function playbackReducer(playback: PlaybackData, action: any) {
  switch (action.type) {
    case 'update': {
      return {...action.playback};
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
};

const initialState = {
  id: "",
  uri: "",
  playingType: "",
  title: "Hey there!",
  img: "./assets/pfp.png",
  artist: "Play something on Spotify to start",
  isSaved: null,
  isPlaying: false,
  shuffleState: false,
  repeatState: "off",
  progress: 0,
  duration:100,
  context: { type: "", uri: ""}
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
