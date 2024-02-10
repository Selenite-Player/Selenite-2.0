/* eslint-disable testing-library/no-node-access */
import { render, screen } from '@testing-library/react';
import { expect as jExpect } from '@jest/globals';
import App from '../App';
const { ipcRenderer } = require('electron');

jest.mock(
  'electron',
  () => {
    const mElectron = { ipcRenderer: { on: jest.fn(), send: jest.fn() } };
    return mElectron;
  }
);

test('Component renders', () => {
  render(<App />);
  
  const el = document.getElementById('player');
  jExpect(el).not.toBe('null');
});

test('Requests song data on first render', () => {
  render(<App />);
  
  expect(ipcRenderer.send).toHaveBeenCalledTimes(1);
  expect(ipcRenderer.send).toBeCalledWith("update-song-info");
});