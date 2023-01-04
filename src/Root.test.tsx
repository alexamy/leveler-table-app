import { expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { TextInput } from 'react-native';
import App from '../App';

// suppress console warn: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

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

it.todo('deletes project size by one press');

it.todo('properly handles deletion of last added empty size');

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

it.todo('saves state to local storage');
it.todo('populates state from link query');
it.todo('copies table to clipboard');
