import { expect, it } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { TextInput } from 'react-native';
import { Root } from '../Root';

it('calculates difference from zero point to project size', () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));
  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '500');
  fireEvent.changeText(input1, '150');

  expect(screen.getByText('350')).toBeVisible();
});

it('calculates difference from zero point to project size as negative number', () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));
  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '50');
  fireEvent.changeText(input1, '150');

  expect(screen.getByText('-100')).toBeVisible();
});

it('recalculates differences when zero size is changed', () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));
  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '500');
  fireEvent.changeText(input1, '150');
  fireEvent.changeText(inputZero, '200');

  expect(screen.getByText('50')).toBeVisible();
});

it('dont show difference if zero value is empty', async () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));
  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '');
  fireEvent.changeText(input1, '150');

  await waitFor(() => expect(screen.queryByText('-150')).toBe(null));
});

it('dont show difference if project size value is empty', async () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));
  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '150');
  fireEvent.changeText(input1, '');

  await waitFor(() => expect(screen.queryByText('150')).toBe(null));
});

it('recalculates offset when changing zero point', () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));
  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '500');
  fireEvent.changeText(input1, '150');
  fireEvent.changeText(inputZero, '400');

  expect(screen.getByText('250')).toBeVisible();
});

it('recalculates offset when changing measurement size', () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));
  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '500');
  fireEvent.changeText(input1, '150');
  fireEvent.changeText(input1, '250');

  expect(screen.getByText('250')).toBeVisible();
});

it('shows empty offset if has malformed size', () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));
  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '500');
  fireEvent.changeText(input1, 'x150');

  expect(screen.getByTestId('text-offset-0')).toHaveTextContent("");
});

it('shows empty offset if has malformed zero point', () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));
  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, 'x500');
  fireEvent.changeText(input1, '150');

  expect(screen.getByTestId('text-offset-0')).toHaveTextContent("");
});
