import { describe, expect, it } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { TextInput } from 'react-native';
import App from '../../App';

it('loads state from local storage', async () => {
  render(<App />);

  await waitFor(() => {
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
  });

  // TODO why?
  await waitFor(() => {
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  });

  act(() => {
    const input = screen.getByTestId('input-zero-0') as TextInput;
    fireEvent.changeText(input, '100');
  });

  await waitFor(() => {
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2);
  });
});

it.todo('resets to default state if local storage has malformed state');

describe('links', () => {
  it.todo('saves state to a link');
  it.todo('populates state from a link');
  it.todo('dont reset app state if link has malformed state');
});
