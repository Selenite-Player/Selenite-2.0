import { render, screen, fireEvent } from '@testing-library/react';
import TimeRange from '../../components/TimeRange';
const { ipcRenderer } = require('electron');

jest.mock(
  'electron',
  () => {
    const mElectron = { ipcRenderer: { on: jest.fn(), send: jest.fn() } };
    return mElectron;
  }
);

test('Component is being rendered', () => {
  render(<TimeRange progress={0} duration={100} />);
  const el = screen.getByLabelText('time-range');
  expect(el).toBeInTheDocument();
});

test('Range correctly displays song progress', () => {
  render(<TimeRange progress={30} duration={100} />);
  const el = screen.getByLabelText('time-range');
  expect(el).toHaveValue("30");
});

test('Changing the slider sends seek event with correct data', () => {
  render(<TimeRange progress={30} duration={100} />);
  const el = screen.getByLabelText('time-range');
  fireEvent.change(el, { target: { value: 60 } });
  expect(ipcRenderer.send).toBeCalledWith('seek', "60");
});