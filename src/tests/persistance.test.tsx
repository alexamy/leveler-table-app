import { describe, expect, it, jest } from '@jest/globals';
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
import { app } from './app';

it('loads state from local storage', async () => {
  render(<App />);

  await waitFor(() => {
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
  });
});

it('saves state to local storage when the worker changes it', async () => {
  render(<App />);

  await waitFor(() => {
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
  });

  act(() => {
    const input = screen.getByTestId('input-zero-0') as TextInput;
    fireEvent.changeText(input, '100');
  });

  await waitFor(() => {
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'leveler-app',
      expect.stringContaining('"zero":"100"')
    );
  });
});

it('does not write anything before the saved state has loaded', async () => {
  render(<App />);

  await waitFor(() => {
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
  });

  expect(AsyncStorage.setItem).not.toHaveBeenCalled();
});

it('saves the mode when the worker flips the switch', async () => {
  render(<App />);

  await waitFor(() => {
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
  });

  act(() => {
    fireEvent(app.mode(), 'valueChange', true);
  });

  await waitFor(() => {
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'leveler-app',
      expect.stringContaining('"mode":"entered"')
    );
  });
});

it('resets to default state if local storage has malformed state', async () => {
  jest.mocked(AsyncStorage.getItem).mockResolvedValue('{ not json');

  render(<App />);

  await waitFor(() => {
    expect(app.zero().props.value).toBe('');
  });
});

it('fills in fields missing from the saved state', async () => {
  jest.mocked(AsyncStorage.getItem).mockResolvedValue('{"zero":"500"}');

  render(<App />);

  await waitFor(() => {
    expect(app.zero().props.value).toBe('500');
  });

  expect(app.mode().props.value).toBe(false);
  expect(app.measurements()).toHaveLength(0);
});

it('does not save the delete-hold indicator', async () => {
  render(<App />);

  await waitFor(() => {
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
  });

  act(() => {
    fireEvent(app.clearData(), 'pressIn');
  });

  await waitFor(() => {
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  expect(AsyncStorage.setItem).not.toHaveBeenCalledWith(
    'leveler-app',
    expect.stringContaining('waitingDeletion')
  );
});

describe('links', () => {
  it.todo('saves state to a link');
  it.todo('populates state from a link');
  it.todo('dont reset app state if link has malformed state');
});
