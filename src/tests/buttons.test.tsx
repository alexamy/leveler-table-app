import { jest, expect, it } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Root } from '..';
import { app } from './app';

it('clears the state after clear button press', async () => {
  render(<Root />);

  fireEvent.changeText(app.zero(), '500');
  fireEvent.changeText(app.step(), '500');
  fireEvent.press(app.addSize());
  fireEvent.press(app.addSize());

  fireEvent(app.clearData(), 'pressIn');
  expect(app.pendingDeletion()).toBeVisible();

  act(() => jest.advanceTimersByTime(5000));
  fireEvent(app.clearData(), 'pressOut');

  expect(app.zero().props.value).toBe('');
  expect(app.step().props.value).toBe('');
  expect(screen.queryByTestId('input-size-0')).toBe(null);
});

it('clear button waits for 1500 ms before deletion', async () => {
  render(<Root />);

  fireEvent.changeText(app.zero(), '500');
  fireEvent.changeText(app.step(), '200');
  fireEvent.press(app.addSize());

  fireEvent(app.clearData(), 'pressIn');
  expect(app.pendingDeletion()).toBeVisible();

  act(() => jest.advanceTimersByTime(1000));
  fireEvent(app.clearData(), 'pressOut');

  act(() => jest.advanceTimersByTime(50_000));
  expect(app.zero().props.value).toBe('500');
  expect(app.step().props.value).toBe('200');
  expect(app.measurement(1).size).toBeVisible();
});

it('disables add button on empty zero size or offset', () => {
  render(<Root />);

  expect(app.addSize().props.accessibilityState?.disabled).toBe(true);

  // only zero size
  fireEvent.changeText(app.zero(), '50');
  fireEvent.changeText(app.step(), '');
  expect(app.addSize().props.accessibilityState?.disabled).toBe(true);

  // only step
  fireEvent.changeText(app.zero(), '');
  fireEvent.changeText(app.step(), '50');
  expect(app.addSize().props.accessibilityState?.disabled).toBe(true);

  // enabled if both entered
  fireEvent.changeText(app.zero(), '500');
  fireEvent.changeText(app.step(), '50');
  expect(app.addSize().props.accessibilityState?.disabled).toBe(false);
});
