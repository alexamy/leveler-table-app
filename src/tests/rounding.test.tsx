import { expect, it } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { TextInput } from 'react-native';
import { Root } from '../Root';

it('rounds offset to 2 decimal places', () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));
  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '0.35');
  fireEvent.changeText(input1, '0.1');

  expect(screen.getByTestId('text-offset-0')).toHaveTextContent(/0\.25$/);
});

it('rounds offset to 1 decimal places', () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));
  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '0.3');
  fireEvent.changeText(input1, '0.1');

  expect(screen.getByTestId('text-offset-0')).toHaveTextContent(/0\.2$/);
});

it('doesnt round offset for integers', () => {
  render(<Root />);

  fireEvent.press(screen.getByTestId('add-size'));
  const inputZero = screen.getByTestId('input-zero-0') as TextInput;
  const input1 = screen.getByTestId('input-size-0') as TextInput;

  fireEvent.changeText(inputZero, '2');
  fireEvent.changeText(input1, '1');

  expect(screen.getByTestId('text-offset-0')).toHaveTextContent('1');
});
