import { afterEach, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react-native';
import { Keyboard } from 'react-native';
import { Root } from '..';
import { app } from './app';
import { defaultState } from '../reducer';

afterEach(() => {
  jest.restoreAllMocks();
});

it('closes the keyboard when a row is removed', () => {
  const dismiss = jest.spyOn(Keyboard, 'dismiss');
  render(<Root state={{ ...defaultState, mode: 'entered', zero: '500' }} />);

  fireEvent.press(app.addSize());
  fireEvent.changeText(app.measurement(1).size, '520');
  expect(dismiss).not.toHaveBeenCalled();

  fireEvent.press(app.measurement(1).delete);

  expect(dismiss).toHaveBeenCalled();
});

it('closes the keyboard when the data is cleared', () => {
  const dismiss = jest.spyOn(Keyboard, 'dismiss');
  render(<Root state={{ ...defaultState, mode: 'entered', zero: '500' }} />);

  fireEvent.press(app.addSize());
  fireEvent.changeText(app.measurement(1).size, '520');

  fireEvent(app.clearData(), 'pressIn');
  expect(dismiss).not.toHaveBeenCalled();

  act(() => jest.advanceTimersByTime(2000));
  fireEvent(app.clearData(), 'pressOut');

  expect(dismiss).toHaveBeenCalled();
});

it('closes the keyboard when the mode changes', () => {
  const dismiss = jest.spyOn(Keyboard, 'dismiss');
  render(<Root state={{ ...defaultState, mode: 'entered', zero: '500' }} />);

  fireEvent.press(app.addSize());
  expect(dismiss).not.toHaveBeenCalled();

  fireEvent(app.mode(), 'valueChange', false);

  expect(dismiss).toHaveBeenCalled();
});

it('clears once however long the button is held', () => {
  const dismiss = jest.spyOn(Keyboard, 'dismiss');
  render(<Root state={{ ...defaultState, mode: 'entered', zero: '500' }} />);

  fireEvent(app.clearData(), 'pressIn');
  act(() => jest.advanceTimersByTime(1600));
  act(() => jest.advanceTimersByTime(1600));
  act(() => jest.advanceTimersByTime(1600));
  fireEvent(app.clearData(), 'pressOut');

  expect(dismiss).toHaveBeenCalledTimes(1);
});
