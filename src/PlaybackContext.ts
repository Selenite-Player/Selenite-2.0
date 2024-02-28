import { createContext } from 'react';

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

export const PlaybackContext = createContext<PlaybackData>(initialState);
export const PlaybackDispatchContext = createContext<any>(null);