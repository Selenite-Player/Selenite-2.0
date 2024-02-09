import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlbumCover from '../../components/AlbumCover';
const { ipcRenderer } = require('electron');

const imgSrc: string = '../../../public/assets/selenite.png';

jest.mock(
  'electron',
  () => {
    const mElectron = { ipcRenderer: { on: jest.fn(), send: jest.fn() } };
    return mElectron;
  }
);

test('Shows album cover image', () => {
  render(<AlbumCover imgSrc={imgSrc} isSaved={true} />);
  const el = screen.getByRole('img');
  expect(el).toBeInTheDocument();
  expect(el.getAttribute('src')).toBe(imgSrc);
});

test('Sends event message when heart icon is clicked', async () => {
  const user = userEvent.setup();
  render(<AlbumCover imgSrc={imgSrc} isSaved={true} />);
  await user.click(screen.getByLabelText('save-song'));
  expect(ipcRenderer.send).toBeCalledWith('save-song');
});

test('Shows filled heart icon if song is saved', () => {
  render(<AlbumCover imgSrc={imgSrc} isSaved={true} />);
  const el = screen.getByLabelText('save-song');
  expect(el.getAttribute('class')).toContain('full');
});

test('Shows outlined heart icon if song is not saved', () => {
  render(<AlbumCover imgSrc={imgSrc} isSaved={false} />);
  const el = screen.getByLabelText('save-song');
  expect(el.getAttribute('class')).toContain('outline');
});

test('Shows no heart icon if isSaved is null', () => {
  render(<AlbumCover imgSrc={imgSrc} isSaved={null} />);
  const el = screen.getByLabelText('save-song');
  expect(el).toHaveStyle('display: none;');
});