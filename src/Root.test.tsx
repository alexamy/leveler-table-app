import { expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { TextInput } from 'react-native';
import App from '../App';

// suppress console warn: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

it('shows zero point label', () => {
  render(<App />);

  expect(screen.getByText('Нулевая точка')).toBeVisible();
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

  expect(screen.getByText('Проектные размеры')).toBeVisible();
});

it('allows to enter project size', () => {
  render(<App />);

  const input = screen.getByTestId('input-size-1') as TextInput;
  fireEvent.changeText(input, '100');

  expect(input.props.value).toBe('100');
});

it('allows to add more project sizes', () => {
  render(<App />);

  const input1 = screen.getByTestId('input-size-1') as TextInput;
  fireEvent.changeText(input1, '12');

  const input2 = screen.getByTestId('input-size-2') as TextInput;

  expect(input2).toBeVisible();
  expect(input2.props.value).toBe('');
});

it('render additional project size input only for last input', () => {
  render(<App />);

  fireEvent.changeText(screen.getByTestId('input-size-1'), '12');
  fireEvent.changeText(screen.getByTestId('input-size-2'), '24');

  fireEvent.changeText(screen.getByTestId('input-size-1'), '');
  fireEvent.changeText(screen.getByTestId('input-size-2'), '');

  expect(screen.getByTestId('input-size-3')).toBeVisible();
  expect(screen.queryByTestId('input-size-4')).toBe(null);
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

it.todo('deletes project size');

it.todo('dont allow to delete single project size');

it('calculates difference from zero point to project size', () => {
  render(<App />);

  const inputZero = screen.getByTestId('input-zero-1') as TextInput;
  const input1 = screen.getByTestId('input-size-1') as TextInput;

  fireEvent.changeText(inputZero, '500');
  fireEvent.changeText(input1, '150');

  const target1 = screen.getByTestId('result-1');
  expect(target1).toHaveTextContent('350');
});

it.todo('calculates difference from zero point to project size as negative number');

it.todo('recalculates differences when zero size is changed');

it.todo('shows first size position as 0');
it.todo('shows next sizes positions as consecutive integers');
