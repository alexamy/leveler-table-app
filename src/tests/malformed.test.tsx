import { expect, it, describe } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { TextInput } from 'react-native';
import { Root } from '../Root';

describe('malformed input', () => {
  it('shows empty offset if has malformed size', () => {
    render(<Root />);

    fireEvent.press(screen.getByTestId('add-size'));
    const inputZero = screen.getByTestId('input-zero-0') as TextInput;
    const input1 = screen.getByTestId('input-size-0') as TextInput;

    fireEvent.changeText(inputZero, '500');
    fireEvent.changeText(input1, 'x150');

    expect(screen.getByTestId('text-offset-0')).toHaveTextContent('');
  });

  it('shows empty offset if has malformed zero point', () => {
    render(<Root />);

    fireEvent.press(screen.getByTestId('add-size'));
    const inputZero = screen.getByTestId('input-zero-0') as TextInput;
    const input1 = screen.getByTestId('input-size-0') as TextInput;

    fireEvent.changeText(inputZero, 'x500');
    fireEvent.changeText(input1, '150');

    expect(screen.getByTestId('text-offset-0')).toHaveTextContent('');
  });
});
