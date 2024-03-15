import { createContext } from 'react';

export type PlaybackData = {
  id: string,
  uri: string,
  playingType: string,
  title: string,
  img: string,
  artist: string,
  isSaved: boolean | null,
  isPlaying: boolean,
  shuffleState: boolean,
  repeatState: string,
  progress: number,
  duration: number,
  context: {
    type: string,
    uri: string
  } | undefined
};

export const PlaybackContext = createContext<PlaybackData>({} as PlaybackData);
export const PlaybackDispatchContext = createContext<any>(null);