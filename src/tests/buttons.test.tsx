import { jest, expect, it } from '@jest/globals';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { Root } from '../Root';
import { app } from './app';

it('clears the state after clear button press', async () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));
  fireEvent.press(screen.getByTestId('add-size'));
  fireEvent.changeText(screen.getByTestId('input-zero-0'), '500');
  fireEvent.changeText(screen.getByTestId('input-size-0'), '300');
  fireEvent.changeText(screen.getByTestId('input-size-1'), '300');

  fireEvent(screen.getByTestId('clear-data'), 'pressIn');
  expect(
    screen.getByText('Удерживай для удаления всех значений')
  ).toBeVisible();

  act(() => {
    jest.advanceTimersByTime(5000);
  });

  fireEvent(screen.getByTestId('clear-data'), 'pressOut');

  await waitFor(() => {
    expect(screen.getByTestId('input-zero-0')).toHaveTextContent('');
    expect(screen.queryByTestId('input-size-0')).toBe(null);
  });
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
