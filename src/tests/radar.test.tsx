import { expect, it, jest } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import App from '../../App';
import { Root } from '..';
import { app } from './app';

// audio has no place in a test run, and the module is the only door to it
jest.mock('../beep', () => ({ useBeep: () => undefined }));

// short enough that the 1500 ms clear hold never fires
function tap(times: number, gapMs = 100) {
  for (let index = 0; index < times; index++) {
    fireEvent(app.clearData(), 'pressIn');
    fireEvent(app.clearData(), 'pressOut');
    act(() => jest.advanceTimersByTime(gapMs));
  }
}

it('opens the radar on five quick taps of the clear button', () => {
  render(<Root />);

  tap(5);

  expect(app.radar()).not.toBeNull();
});

it('stays on the table after four taps', () => {
  render(<Root />);

  tap(4);

  expect(app.radar()).toBeNull();
});

it('stays on the table when the taps are spread beyond the streak gap', () => {
  render(<Root />);

  tap(5, 600);

  expect(app.radar()).toBeNull();
});

it('clears the table on a hold without opening the radar', () => {
  render(<Root />);

  fireEvent.changeText(app.zero(), '500');
  fireEvent.changeText(app.step(), '200');

  fireEvent(app.clearData(), 'pressIn');
  act(() => jest.advanceTimersByTime(2000));
  fireEvent(app.clearData(), 'pressOut');

  expect(app.zero().props.value).toBe('');
  expect(app.radar()).toBeNull();
});

it('does not count a completed hold towards the streak', () => {
  render(<Root />);

  fireEvent(app.clearData(), 'pressIn');
  act(() => jest.advanceTimersByTime(2000));
  fireEvent(app.clearData(), 'pressOut');

  tap(4);

  expect(app.radar()).toBeNull();
});

it('names what it is looking for', () => {
  render(<Root />);

  tap(5);

  expect(app.radarLabel()).not.toBeNull();
});

it('takes the label away with the radar', () => {
  render(<Root />);

  tap(5);
  fireEvent.press(app.radar());

  expect(app.radarLabel()).toBeNull();
});

it('draws the dial', () => {
  render(<Root />);

  tap(5);

  expect(app.radarDial()).not.toBeNull();
});

it('closes the radar on a tap', () => {
  render(<Root />);

  tap(5);
  fireEvent.press(app.radar());

  expect(app.radar()).toBeNull();
});

it('closes the radar on the android back button', () => {
  render(<Root />);

  tap(5);
  fireEvent(app.radarScreen(), 'requestClose');

  expect(app.radar()).toBeNull();
});

it('leaves the table as it was after the radar closes', () => {
  render(<Root />);

  fireEvent.changeText(app.zero(), '500');
  fireEvent.changeText(app.step(), '200');
  fireEvent.press(app.addSize());

  tap(5);
  fireEvent.press(app.radar());

  expect(app.zero().props.value).toBe('500');
  expect(app.step().props.value).toBe('200');
  expect(app.measurement(1).size.props.value).toBe('700');
});

it('does not save the radar', async () => {
  render(<App />);
  await waitFor(() => {
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
  });

  act(() => tap(5));
  await act(async () => {
    fireEvent.changeText(app.zero(), '100');
  });

  expect(AsyncStorage.setItem).toHaveBeenCalledWith(
    'leveler-app',
    expect.stringContaining('"zero":"100"')
  );
  expect(AsyncStorage.setItem).not.toHaveBeenCalledWith(
    'leveler-app',
    expect.stringContaining('radar')
  );
});

it('does not restore a radar saved by an older build', async () => {
  jest
    .mocked(AsyncStorage.getItem)
    .mockResolvedValue(
      '{"mode":"generated","zero":"500","step":"10","measurements":[],"radar":true}'
    );

  render(<App />);

  await waitFor(() => {
    expect(app.zero().props.value).toBe('500');
  });

  expect(app.radar()).toBeNull();
});
