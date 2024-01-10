import { expect, it } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { TextInput } from 'react-native';
import { Root } from '../Root';

it('shows step label', () => {
  render(<Root />);

  expect(screen.getByPlaceholderText('Шаг')).toBeVisible();
});

it('calculates new size as zero point + step', () => {
  render(<Root />);

  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const inputStep = screen.getByTestId('input-step') as TextInput;

  fireEvent.changeText(inputZero, '500');
  fireEvent.changeText(inputStep, '50');
  fireEvent.press(screen.getByTestId('add-size'));

  const input1 = screen.getByTestId('input-size-0') as TextInput;

  expect(input1.props.value).toBe('550');
});

it('calculates new size as zero point + step when step is negative', () => {
  render(<Root />);

  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const inputStep = screen.getByTestId('input-step') as TextInput;

  fireEvent.changeText(inputZero, '500');
  fireEvent.changeText(inputStep, '-50');
  fireEvent.press(screen.getByTestId('add-size'));

  const input1 = screen.getByTestId('input-size-0') as TextInput;

  expect(input1.props.value).toBe('450');
});

it('calculates new size as previous size + step when single step is presented', () => {
  render(<Root />);

  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const inputStep = screen.getByTestId('input-step') as TextInput;

  fireEvent.changeText(inputZero, '500');
  fireEvent.changeText(inputStep, '50');
  fireEvent.press(screen.getByTestId('add-size'));
  fireEvent.press(screen.getByTestId('add-size'));

  const input1 = screen.getByTestId('input-size-0') as TextInput;
  const input2 = screen.getByTestId('input-size-1') as TextInput;

  expect(input1.props.value).toBe('550');
  expect(input2.props.value).toBe('600');
});

it('doesnt calculate new size if step is empty', () => {
  render(<Root />);

  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const inputStep = screen.getByTestId('input-step') as TextInput;

  fireEvent.changeText(inputZero, '500');
  fireEvent.changeText(inputStep, '');
  fireEvent.press(screen.getByTestId('add-size'));

  const input1 = screen.getByTestId('input-size-0') as TextInput;

  expect(input1.props.value).toBe('');
});

it('doesnt calculate new size if step is malformed', () => {
  render(<Root />);

  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const inputStep = screen.getByTestId('input-step') as TextInput;

  fireEvent.changeText(inputZero, '500');
  fireEvent.changeText(inputStep, 'x50');
  fireEvent.press(screen.getByTestId('add-size'));

  const input1 = screen.getByTestId('input-size-0') as TextInput;

  expect(input1.props.value).toBe('');
});

it("doesn't calculate new size if zero point is empty", () => {
  render(<Root />);

  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const inputStep = screen.getByTestId('input-step') as TextInput;

  fireEvent.changeText(inputZero, '');
  fireEvent.changeText(inputStep, '50');
  fireEvent.press(screen.getByTestId('add-size'));

  const input1 = screen.getByTestId('input-size-0') as TextInput;

  expect(input1.props.value).toBe('');
});

it("doesn't calculate new size if zero point is malformed", () => {
  render(<Root />);

  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const inputStep = screen.getByTestId('input-step') as TextInput;

  fireEvent.changeText(inputZero, 'x500');
  fireEvent.changeText(inputStep, '50');
  fireEvent.press(screen.getByTestId('add-size'));

  const input1 = screen.getByTestId('input-size-0') as TextInput;

  expect(input1.props.value).toBe('');
});
