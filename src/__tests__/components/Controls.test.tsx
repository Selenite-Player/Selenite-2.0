/* eslint-disable testing-library/no-node-access */
import { render, screen } from '@testing-library/react';
import { expect as jExpect } from '@jest/globals';
import userEvent from '@testing-library/user-event';
import Controls from '../../components/Controls';
const { ipcRenderer } = require('electron');

jest.mock(
  'electron',
  () => {
    const mElectron = { ipcRenderer: { on: jest.fn(), send: jest.fn() } };
    return mElectron;
  }
);

type ControlsProps = {
  repeatState: string,
  shuffleState: boolean,
  isPlaying: boolean
}

const repeatOptions = ["off", "track", "context"];

const defaultData: ControlsProps = {
  repeatState: repeatOptions[0],
  shuffleState: false,
  isPlaying: false
};

test('Component renders', () => {
  render(<Controls {...defaultData} />);
  
  const el = document.getElementById('controls');
  jExpect(el).not.toBe('null');
});

test('Clicking the play icon sends a play event', async () => {
  const user = userEvent.setup();
  render(<Controls {...defaultData} />);
  await user.click(screen.getByLabelText('play'));
  expect(ipcRenderer.send).toBeCalledWith('play');
});

test('Correct icon is displayed when a song is on pause', () => {
  render(<Controls {...defaultData} />);
  const el = screen.getByLabelText('play');
  expect(el).toHaveClass("fa-play");
});

test('Correct icon is displayed when a song is on play', () => {
  const data = {...defaultData, isPlaying: true};
  render(<Controls {...data} />);
  const el = screen.getByLabelText('play');
  expect(el).toHaveClass("fa-pause");
});

test('Clicking the pause icon sends a pause event', async () => {
  const user = userEvent.setup();
  const data = {...defaultData, isPlaying: true}
  render(<Controls {...data} />);
  await user.click(screen.getByLabelText('play'));
  expect(ipcRenderer.send).toBeCalledWith('pause');
});

test('Shuffle icon changes color if shuffle is activated', async () => {
  const data = {...defaultData, shuffleState: true}
  render(<Controls {...data} />);
  const el = screen.getByLabelText('shuffle');
  expect(el).toHaveClass('active');
});

test('Clicking shuffle changes icon color', async () => {
  const user = userEvent.setup();
  render(<Controls {...defaultData} />);
  await user.click(screen.getByLabelText('shuffle'));
  expect(ipcRenderer.send).toBeCalledWith('shuffle', !defaultData.shuffleState);
});

test('Clicking repeat sends a repeat event with new repeat value', async () => {
  const user = userEvent.setup();
  render(<Controls {...defaultData} />);
  await user.click(screen.getByLabelText('repeat'));
  expect(ipcRenderer.send).toBeCalledWith('repeat', repeatOptions[1]);
});

test('Correct icon is displayed when repeat state is set to "track"', async () => {
  const data = {...defaultData, repeatState: "track"}
  render(<Controls {...data} />);
  const el = screen.getByLabelText('repeat');
  expect(el).toHaveClass("fa-repeat active");
});

test('Correct icon is displayed when repeat state is set to "context"', async () => {
  const data = {...defaultData, repeatState: "context"}
  render(<Controls {...data} />);
  const el = screen.getByLabelText('repeat');
  expect(el).toHaveClass("fa fa-refresh active");
});

test('Clicking skip sends a skip event message', async () => {
  const user = userEvent.setup();
  render(<Controls {...defaultData} />);
  await user.click(screen.getByLabelText('next'));
  expect(ipcRenderer.send).toBeCalledWith('next-song');
});

test('Clicking prev sends a previous event message', async () => {
  const user = userEvent.setup();
  render(<Controls {...defaultData} />);
  await user.click(screen.getByLabelText('previous'));
  expect(ipcRenderer.send).toBeCalledWith('previous-song');
});