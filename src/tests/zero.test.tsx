import { expect, it } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { TextInput } from 'react-native';
import { Root } from '../Root';

it('shows zero point label', () => {
  render(<Root />);

  expect(screen.getByPlaceholderText('Нулевая точка')).toBeVisible();
});

it('allows to enter zero point', async () => {
  render(<Root />);

  const input = screen.getByTestId('input-zero-0') as TextInput;
  fireEvent.changeText(input, '100');

  expect(input.props.value).toBe('100');
});

it('highlight zero point if it has incorrect format', () => {
  render(<Root />);

  const input = screen.getByTestId('input-zero-0') as TextInput;

  expect(input.props.style).toMatchObject({ color: '#242424' });

  fireEvent.changeText(input, 'x');

  expect(input.props.style).toMatchObject({ color: '#ff190c' });
});

it.each([
  { value: 'xyz4xyz', expected: 'xyz4xyz', kind: 'letter' },
  { value: '-42', expected: '-42', kind: 'negative' },
  { value: '10.5', expected: '10.5', kind: 'float' },
])('allows entering $kind value in zero point input', ({ value, expected }) => {
  render(<Root />);

  const input = screen.getByTestId('input-zero-0') as TextInput;
  fireEvent.changeText(input, value);

  expect(input.props.value).toBe(expected);
});
