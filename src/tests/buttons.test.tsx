import { jest, expect, it } from '@jest/globals';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Root } from '../Root';

it('clears the state after clear button press', async () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));
  fireEvent.press(screen.getByTestId('add-size'));
  fireEvent.changeText(screen.getByTestId('input-zero-0'), '500');
  fireEvent.changeText(screen.getByTestId('input-size-0'), '300');
  fireEvent.changeText(screen.getByTestId('input-size-1'), '300');

  act(() => {
    fireEvent(screen.getByTestId('clear-data'), 'pressIn');
    jest.advanceTimersByTime(5000);
    fireEvent(screen.getByTestId('clear-data'), 'pressOut');
  });

  await waitFor(() => {
    expect(screen.getByTestId('input-zero-0')).toHaveTextContent("");
    expect(screen.queryByTestId('input-size-0')).toBe(null);
  });
});
