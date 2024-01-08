import { expect, it, jest, afterEach } from '@jest/globals';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { TextInput } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { dedent } from 'ts-dedent';
import App from '../App';

// suppress console warn: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

afterEach(() => {
  jest.resetAllMocks();
});

it('shows zero point label', () => {
  render(<App />);

  expect(screen.getByPlaceholderText('Нулевая точка')).toBeVisible();
});

it('allows to enter zero point', async () => {
  render(<App />);

  const input = screen.getByTestId('input-zero-0') as TextInput;
  fireEvent.changeText(input, '100');

  expect(input.props.value).toBe('100');
});

it.each([
  { value: 'xyz4xyz', expected: 'xyz4xyz', kind: 'letter' },
  { value: '-42', expected: '-42', kind: 'negative' },
  { value: '10.5', expected: '10.5', kind: 'float' },
])('allows entering $kind value in zero point input', ({ value, expected }) => {
  render(<App />);

  const input = screen.getByTestId('input-zero-0') as TextInput;
  fireEvent.changeText(input, value);

  expect(input.props.value).toBe(expected);
});

it('shows project sizes label', () => {
  render(<App />);

  expect(screen.getByPlaceholderText('Проектный размер')).toBeVisible();
});

it('allows to enter project size', () => {
  render(<App />);

  const input = screen.getByTestId('input-size-0') as TextInput;
  fireEvent.changeText(input, '100');

  expect(input.props.value).toBe('100');
});

it.each([
  { value: 'xyz4xyz', expected: 'xyz4xyz', kind: 'letter' },
  { value: '-42', expected: '-42', kind: 'negative' },
  { value: '10.5', expected: '10.5', kind: 'float' },
])('allows entering $kind value in project size input', ({ value, expected }) => {
  render(<App />);

  const input = screen.getByTestId('input-size-0') as TextInput;
  fireEvent.changeText(input, value);

  expect(input.props.value).toBe(expected);
});

it('allows to add more project sizes', () => {
  render(<App />);

  fireEvent.press(screen.getByText('+'));

  expect(screen.getByTestId('input-size-1')).toBeVisible();
});

it('dont render more than one additional project size input', () => {
  render(<App />);

  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(input1, '1');
  fireEvent.changeText(input1, '');
  fireEvent.changeText(input1, '2');

  expect(screen.queryByTestId('input-size-2')).toBe(null);
  expect(screen.queryByTestId('input-size-3')).toBe(null);
});

it('shows delete button', () => {
  render(<App />);

  expect(screen.getByText('−')).toBeVisible();
});

it('deletes project size', () => {
  render(<App />);

  fireEvent.press(screen.getByText('+'));
  fireEvent.press(screen.getByTestId('delete-size-2'));

  expect(screen.queryByTestId('input-size-1')).toBe(null);
});

it('dont allow to delete single project size', () => {
  render(<App />);

  expect(screen.getByTestId('delete-size-1')).toBeDisabled();
});

it('calculates difference from zero point to project size', () => {
  render(<App />);

  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '500');
  fireEvent.changeText(input1, '150');

  expect(screen.getByText('350')).toBeVisible();
});

it('calculates difference from zero point to project size as negative number', () => {
  render(<App />);

  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '50');
  fireEvent.changeText(input1, '150');

  expect(screen.getByText('-100')).toBeVisible();
});

it('recalculates differences when zero size is changed', () => {
  render(<App />);

  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '500');
  fireEvent.changeText(input1, '150');
  fireEvent.changeText(inputZero, '200');

  expect(screen.getByText('50')).toBeVisible();
});

it('dont show difference if zero value is empty', () => {
  render(<App />);

  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '');
  fireEvent.changeText(input1, '150');

  expect(screen.queryByText('-150')).toBe(null);
});

it('dont show difference if project size value is empty', () => {
  render(<App />);

  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '150');
  fireEvent.changeText(input1, '');

  expect(screen.queryByText('150')).toBe(null);
});

it('shows first size position as 0', () => {
  render(<App />);

  expect(screen.getByText('0')).toBeVisible();
});

it('shows next sizes positions as consecutive integers', () => {
  render(<App />);

  fireEvent.press(screen.getByText('+'));

  expect(screen.getByText('1')).toBeVisible();
});

it('saves state to local storage', () => {
  render(<App />);

  fireEvent.changeText(screen.getByTestId('input-zero-0'), '50');

  expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  expect(AsyncStorage.setItem).toHaveBeenCalledWith(
    '@leveler-app',
    expect.anything(),
  );
});

it('loads state from local storage', async () => {
  jest.spyOn(AsyncStorage, 'getItem').mockImplementation(() => {
    const data = JSON.stringify({
      zero: { id: '1', value: 50 },
      sizes: { lastId: 1, map: { '1': { id: '1', value: null }}},
    });

    return Promise.resolve(data);
  });

  render(<App />);

  const input = screen.getByTestId('input-zero-0') as TextInput;

  await waitFor(() => {
    expect(input.props.value).toBe('50');
  });
});

it.todo('resets to default state if local storage has malformed state');

it('copies table to clipboard', async () => {
  render(<App />);

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

it.todo('recalculates offset when changing zero point');
it.todo('recalculates offset when changing measurement size');
it.todo('shows empty offset if has malformed size');
it.todo('shows error if has malformed zero point');

it.todo('clears the state after clear button press');

it.todo('saves state to a link');

it.todo('populates state from a link');

it.todo('dont reset app state if link has malformed state');
