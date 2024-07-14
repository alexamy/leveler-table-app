import { expect, it, jest } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as Clipboard from 'expo-clipboard';
import { TextInput } from 'react-native';
import { dedent } from 'ts-dedent';
import App from '../../App';
import { Root } from '../Root';

it('copies table to clipboard', async () => {
  render(<Root />);

  jest.spyOn(Clipboard, 'setStringAsync');

  fireEvent.press(screen.getByTestId('add-size'));
  fireEvent.press(screen.getByTestId('add-size'));
  fireEvent.changeText(screen.getByTestId('input-zero-0'), '500');
  fireEvent.changeText(screen.getByTestId('input-size-0'), '300');
  fireEvent.changeText(screen.getByTestId('input-size-1'), '125');

  fireEvent.press(screen.getByTestId('copy-to-clipboard'));

  expect(Clipboard.setStringAsync).toHaveBeenCalledWith(dedent`
    Шаг	Нулевая точка	Проектные значения	Результат
    0	500	300	200
    1	500	125	375
  `);
});

it('use tabs between values in serialized table', () => {
  render(<Root />);

  jest.spyOn(Clipboard, 'setStringAsync');

  fireEvent.press(screen.getByTestId('add-size'));
  fireEvent.changeText(screen.getByTestId('input-zero-0'), '500');
  fireEvent.changeText(screen.getByTestId('input-size-0'), '300');

  fireEvent.press(screen.getByTestId('copy-to-clipboard'));

  // @ts-expect-error mock
  const result: string | undefined = Clipboard.setStringAsync.mock.calls?.[0]?.[0];

  expect(result?.includes("\t")).toBe(true);
});

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

it.todo('saves state to a link');
it.todo('populates state from a link');
it.todo('dont reset app state if link has malformed state');
