import { expect, it } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { TextInput } from 'react-native';
import { Root } from '../Root';

it('shows project sizes label', () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));

  expect(screen.getByPlaceholderText('Проектный размер')).toBeVisible();
});

it('allows to enter project size', () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));
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

  fireEvent.press(screen.getByTestId('add-size'));
  const input = screen.getByTestId('input-size-0') as TextInput;
  fireEvent.changeText(input, value);

  expect(input.props.value).toBe(expected);
});

it('highlight project size if it has incorrect format', () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));
  const input = screen.getByTestId('input-size-0') as TextInput;

  expect(input.props.style).toMatchObject({ color: '#242424' });

  fireEvent.changeText(input, 'x');

  expect(input.props.style).toMatchObject({ color: '#ff190c' });
});

it('allows to add more project sizes', () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));
  fireEvent.press(screen.getByTestId('add-size'));

  expect(screen.getByTestId('input-size-1')).toBeVisible();
});

it('dont render more than one additional project size input', () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(input1, '1');
  fireEvent.changeText(input1, '');
  fireEvent.changeText(input1, '2');

  expect(screen.queryByTestId('input-size-2')).toBe(null);
  expect(screen.queryByTestId('input-size-3')).toBe(null);
});

it('shows delete button', () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));

  expect(screen.getByText('−')).toBeVisible();
});

it('deletes project size', () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));
  fireEvent.press(screen.getByTestId('delete-size-0'));

  expect(screen.queryByTestId('input-size-0')).toBe(null);
});

it('allows to delete single project size', () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));

  expect(screen.getByTestId('delete-size-0')).toBeEnabled();
});

it('shows first size position as 0', () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));

  expect(screen.getByText('0')).toBeVisible();
});

it('shows next sizes positions as consecutive integers', () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));
  fireEvent.press(screen.getByTestId('add-size'));

  expect(screen.getByText('1')).toBeVisible();
});
