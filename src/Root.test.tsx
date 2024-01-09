import { expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { TextInput } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { dedent } from 'ts-dedent';
import { Root } from './Root';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from '../App';

// suppress console warn: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.resetAllMocks();
});

it('shows zero point label', () => {
  render(<Root />);

  expect(screen.getByPlaceholderText('Нулевая точка')).toBeVisible();
});

it('allows to enter zero point', async () => {
  render(<Root />);

  const input = screen.getByTestId('input-zero-0') as TextInput;
  fireEvent.changeText(input, '100');

  expect(input.props.value).toBe('100');
});

it.each([
  { value: 'xyz4xyz', expected: 'xyz4xyz', kind: 'letter' },
  { value: '-42', expected: '-42', kind: 'negative' },
  { value: '10.5', expected: '10.5', kind: 'float' },
])('allows entering $kind value in zero point input', ({ value, expected }) => {
  render(<Root />);

  const input = screen.getByTestId('input-zero-0') as TextInput;
  fireEvent.changeText(input, value);

  expect(input.props.value).toBe(expected);
});

it('shows project sizes label', () => {
  render(<Root />);

  expect(screen.getByPlaceholderText('Проектный размер')).toBeVisible();
});

it('allows to enter project size', () => {
  render(<Root />);

  const input = screen.getByTestId('input-size-0') as TextInput;
  fireEvent.changeText(input, '100');

  expect(input.props.value).toBe('100');
});

it.each([
  { value: 'xyz4xyz', expected: 'xyz4xyz', kind: 'letter' },
  { value: '-42', expected: '-42', kind: 'negative' },
  { value: '10.5', expected: '10.5', kind: 'float' },
])('allows entering $kind value in project size input', ({ value, expected }) => {
  render(<Root />);

  const input = screen.getByTestId('input-size-0') as TextInput;
  fireEvent.changeText(input, value);

  expect(input.props.value).toBe(expected);
});

it('allows to add more project sizes', () => {
  render(<Root />);

  fireEvent.press(screen.getByText('+'));

  expect(screen.getByTestId('input-size-1')).toBeVisible();
});

it('dont render more than one additional project size input', () => {
  render(<Root />);

  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(input1, '1');
  fireEvent.changeText(input1, '');
  fireEvent.changeText(input1, '2');

  expect(screen.queryByTestId('input-size-2')).toBe(null);
  expect(screen.queryByTestId('input-size-3')).toBe(null);
});

it('shows delete button', () => {
  render(<Root />);

  expect(screen.getByText('−')).toBeVisible();
});

it('deletes project size', () => {
  render(<Root />);

  fireEvent.press(screen.getByText('+'));
  fireEvent.press(screen.getByTestId('delete-size-0'));

  expect(screen.queryByTestId('input-size-1')).toBe(null);
});

it('dont allow to delete single project size', () => {
  render(<Root />);

  expect(screen.getByTestId('delete-size-0')).toBeDisabled();
});

it('calculates difference from zero point to project size', () => {
  render(<Root />);

  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '500');
  fireEvent.changeText(input1, '150');

  expect(screen.getByText('350')).toBeVisible();
});

it('calculates difference from zero point to project size as negative number', () => {
  render(<Root />);

  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '50');
  fireEvent.changeText(input1, '150');

  expect(screen.getByText('-100')).toBeVisible();
});

it('recalculates differences when zero size is changed', () => {
  render(<Root />);

  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '500');
  fireEvent.changeText(input1, '150');
  fireEvent.changeText(inputZero, '200');

  expect(screen.getByText('50')).toBeVisible();
});

it('dont show difference if zero value is empty', async () => {
  render(<Root />);

  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '');
  fireEvent.changeText(input1, '150');

  await waitFor(() => expect(screen.queryByText('-150')).toBe(null));
});

it('dont show difference if project size value is empty', async () => {
  render(<Root />);

  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '150');
  fireEvent.changeText(input1, '');

  await waitFor(() => expect(screen.queryByText('150')).toBe(null));
});

it('shows first size position as 0', () => {
  render(<Root />);

  expect(screen.getByText('0')).toBeVisible();
});

it('shows next sizes positions as consecutive integers', () => {
  render(<Root />);

  fireEvent.press(screen.getByText('+'));

  expect(screen.getByText('1')).toBeVisible();
});

it('copies table to clipboard', async () => {
  render(<Root />);

  jest.spyOn(Clipboard, 'setStringAsync');

  fireEvent.changeText(screen.getByTestId('input-zero-0'), '500');
  fireEvent.press(screen.getByText('+'));
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

  fireEvent.changeText(screen.getByTestId('input-zero-0'), '500');
  fireEvent.press(screen.getByText('+'));
  fireEvent.changeText(screen.getByTestId('input-size-0'), '300');

  fireEvent.press(screen.getByTestId('copy-to-clipboard'));

  // @ts-expect-error mock
  const result: string | undefined = Clipboard.setStringAsync.mock.calls?.[0]?.[0];

  expect(result?.includes("\t")).toBe(true);
});

// ToastAndroid is not supported
it.skip('shows a toast when clicking copy button', () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('copy-to-clipboard'));

  expect(screen.getByText("Таблица скопирована!")).toBeVisible();
});

it('clears the state after clear button press', () => {
  render(<Root />);

  fireEvent.changeText(screen.getByTestId('input-zero-0'), '500');
  fireEvent.changeText(screen.getByTestId('input-size-0'), '300');
  fireEvent.press(screen.getByText('+'));
  fireEvent.changeText(screen.getByTestId('input-size-1'), '300');

  fireEvent.press(screen.getByTestId('clear-data'));

  expect(screen.getByTestId('input-zero-0')).toHaveTextContent("");
  expect(screen.getByTestId('input-size-0')).toHaveTextContent("");
  expect(screen.queryByTestId('input-size-1')).toBe(null);
});

it('recalculates offset when changing zero point', () => {
  render(<Root />);

  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '500');
  fireEvent.changeText(input1, '150');
  fireEvent.changeText(inputZero, '400');

  expect(screen.getByText('250')).toBeVisible();
});

it('recalculates offset when changing measurement size', () => {
  render(<Root />);

  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '500');
  fireEvent.changeText(input1, '150');
  fireEvent.changeText(input1, '250');

  expect(screen.getByText('250')).toBeVisible();
});

it('shows empty offset if has malformed size', () => {
  render(<Root />);

  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '500');
  fireEvent.changeText(input1, 'x150');

  expect(screen.getByTestId('text-offset-0')).toHaveTextContent("");
});

it('shows empty offset if has malformed zero point', () => {
  render(<Root />);

  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, 'x500');
  fireEvent.changeText(input1, '150');

  expect(screen.getByTestId('text-offset-0')).toHaveTextContent("");
});

it.todo('saves state to a link');
it.todo('populates state from a link');
it.todo('dont reset app state if link has malformed state');

it.todo('resets to default state if local storage has malformed state');

// it crashes randomly
it.skip('loads state from local storage', async () => {
  render(<App />);

  await waitFor(() => {
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
  });

  act(() => {
    const input = screen.getByTestId('input-zero-0') as TextInput;
    fireEvent.changeText(input, '100');
  });

  await waitFor(() => {
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  });
});
