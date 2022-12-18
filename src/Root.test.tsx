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

  const input = screen.getByTestId('input-zero-0') as TextInput;
  fireEvent.changeText(input, '100');

  expect(input.props.value).toBe('100');
});

it.each([
  { value: 'xyz4xyz', expected: '4', kind: 'letter' },
  { value: '-42', expected: '42', kind: 'negative' },
  { value: '10.5', expected: '105', kind: 'float' },
])('restricts entering $kind value in zero point input', ({ value, expected }) => {
  render(<App />);

  const input = screen.getByTestId('input-zero-0') as TextInput;
  fireEvent.changeText(input, value);

  expect(input.props.value).toBe(expected);
});

it('shows project sizes label', () => {
  render(<App />);

  expect(screen.getByText('Проектные размеры')).toBeVisible();
});

it('allows to enter project size', () => {
  render(<App />);

  const input = screen.getByTestId('input-size-0') as TextInput;
  fireEvent.changeText(input, '100');

  expect(input.props.value).toBe('100');
});

it('allows to add more project sizes', () => {
  render(<App />);

  const input0 = screen.getByTestId('input-size-0') as TextInput;
  fireEvent.changeText(input0, '12');

  const input1 = screen.getByTestId('input-size-1') as TextInput;

  expect(input1).toBeVisible();
  expect(input1.props.value).toBe(undefined);
});

it('render additional project size input only for last input', () => {
  render(<App />);

  fireEvent.changeText(screen.getByTestId('input-size-0'), '12');
  fireEvent.changeText(screen.getByTestId('input-size-1'), '24');

  fireEvent.changeText(screen.getByTestId('input-size-0'), '');
  fireEvent.changeText(screen.getByTestId('input-size-0'), '12');

  expect(screen.queryByTestId('input-size-2')).toBe(null);
});

it('dont render more than one additional project size input', () => {
  render(<App />);

  const input0 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(input0, '1');
  fireEvent.changeText(input0, '12');

  expect(screen.queryByTestId('input-size-2')).toBe(null);
  expect(screen.queryByTestId('input-size-3')).toBe(null);
});

it.todo('deletes project size');
it.todo('dont allow to delete single project size');

it.todo('calculates difference from zero point to project size');
it.todo('recalculates differences when zero size is changed');

it.todo('shows first size position as 0');
it.todo('shows next sizes positions as consecutive integers');
