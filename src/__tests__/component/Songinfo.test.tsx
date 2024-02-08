import { render, screen } from '@testing-library/react';
import SongInfo from '../../components/SongInfo';

type SongInfoProps = {
  title: string,
  artist: string
}

const song: SongInfoProps = {
  title: "Can You Feel The Love Tonight",
  artist: "Elton John"
}

test('Displays song title', () => {
  render(<SongInfo title={song.title} artist={song.artist}/>);
  const el = screen.getByText(song.title);
  expect(el).toBeInTheDocument();
});

test('Displays song artist', () => {
  render(<SongInfo title={song.title} artist={song.artist}/>);
  const el = screen.getByText(song.artist);
  expect(el).toBeInTheDocument();
});