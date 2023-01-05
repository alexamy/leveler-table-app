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

  const input = screen.getByTestId('input-zero-1') as TextInput;
  fireEvent.changeText(input, '100');

  expect(input.props.value).toBe('100');
});

it.each([
  { value: 'xyz4xyz', expected: '4', kind: 'letter' },
  { value: '-42', expected: '42', kind: 'negative' },
  { value: '10.5', expected: '105', kind: 'float' },
])('restricts entering $kind value in zero point input', ({ value, expected }) => {
  render(<App />);

  const input = screen.getByTestId('input-zero-1') as TextInput;
  fireEvent.changeText(input, value);

  expect(input.props.value).toBe(expected);
});

it('shows project sizes label', () => {
  render(<App />);

  expect(screen.getByPlaceholderText('Проектный размер')).toBeVisible();
});

it('allows to enter project size', () => {
  render(<App />);

  const input = screen.getByTestId('input-size-1') as TextInput;
  fireEvent.changeText(input, '100');

  expect(input.props.value).toBe('100');
});

it.each([
  { value: 'xyz4xyz', expected: '4', kind: 'letter' },
  { value: '-42', expected: '42', kind: 'negative' },
  { value: '10.5', expected: '105', kind: 'float' },
])('restricts entering $kind value in project size input', ({ value, expected }) => {
  render(<App />);

  const input = screen.getByTestId('input-size-1') as TextInput;
  fireEvent.changeText(input, value);

  expect(input.props.value).toBe(expected);
});

it('allows to add more project sizes', () => {
  render(<App />);

  fireEvent.press(screen.getByText('+'));

  expect(screen.getByTestId('input-size-2')).toBeVisible();
});

it('dont render more than one additional project size input', () => {
  render(<App />);

  const input1 = screen.getByTestId('input-size-1') as TextInput;

  fireEvent.changeText(input1, '1');
  fireEvent.changeText(input1, '');
  fireEvent.changeText(input1, '2');

  expect(screen.queryByTestId('input-size-3')).toBe(null);
  expect(screen.queryByTestId('input-size-4')).toBe(null);
});

it('shows delete button', () => {
  render(<App />);

  expect(screen.getByText('−')).toBeVisible();
});

it('deletes project size', () => {
  render(<App />);

  fireEvent.press(screen.getByText('+'));
  fireEvent.press(screen.getByTestId('delete-size-2'));

  expect(screen.queryByTestId('input-size-2')).toBe(null);
});

it('dont allow to delete single project size', () => {
  render(<App />);

  expect(screen.getByTestId('delete-size-1')).toBeDisabled();
});

it('calculates difference from zero point to project size', () => {
  render(<App />);

  const inputZero = screen.getByTestId('input-zero-1') as TextInput;
  const input1 = screen.getByTestId('input-size-1') as TextInput;

  fireEvent.changeText(inputZero, '500');
  fireEvent.changeText(input1, '150');

  expect(screen.getByText('350')).toBeVisible();
});

it('calculates difference from zero point to project size as negative number', () => {
  render(<App />);

  const inputZero = screen.getByTestId('input-zero-1') as TextInput;
  const input1 = screen.getByTestId('input-size-1') as TextInput;

  fireEvent.changeText(inputZero, '50');
  fireEvent.changeText(input1, '150');

  expect(screen.getByText('-100')).toBeVisible();
});

it('recalculates differences when zero size is changed', () => {
  render(<App />);

  const inputZero = screen.getByTestId('input-zero-1') as TextInput;
  const input1 = screen.getByTestId('input-size-1') as TextInput;

  fireEvent.changeText(inputZero, '500');
  fireEvent.changeText(input1, '150');
  fireEvent.changeText(inputZero, '200');

  expect(screen.getByText('50')).toBeVisible();
});

it('dont show difference if zero value is empty', () => {
  render(<App />);

  const inputZero = screen.getByTestId('input-zero-1') as TextInput;
  const input1 = screen.getByTestId('input-size-1') as TextInput;

  fireEvent.changeText(inputZero, '');
  fireEvent.changeText(input1, '150');

  expect(screen.queryByText('-150')).toBe(null);
});

it('dont show difference if project size value is empty', () => {
  render(<App />);

  const inputZero = screen.getByTestId('input-zero-1') as TextInput;
  const input1 = screen.getByTestId('input-size-1') as TextInput;

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

  fireEvent.changeText(screen.getByTestId('input-zero-1'), '50');

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

  const input = screen.getByTestId('input-zero-1') as TextInput;

  await waitFor(() => {
    expect(input.props.value).toBe('50');
  });
});

it('copies table to clipboard', async () => {
  render(<App />);

  jest.spyOn(Clipboard, 'setStringAsync');

  fireEvent.changeText(screen.getByTestId('input-zero-1'), '500');
  fireEvent.press(screen.getByText('+'));
  fireEvent.changeText(screen.getByTestId('input-size-1'), '300');
  fireEvent.changeText(screen.getByTestId('input-size-2'), '125');

  fireEvent.press(screen.getByTestId('copy-to-clipboard'));

  expect(Clipboard.setStringAsync).toHaveBeenCalledWith(dedent`
    Шаг	Нулевая точка	Проектные значения	Результат
    0	500	300	200
    1	500	125	375
  `);
});

it.todo('clears the state after press');

it.todo('saves state to a link');

it.todo('populates state from a link');
