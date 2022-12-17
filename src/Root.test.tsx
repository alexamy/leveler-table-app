import { expect, it } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { TextInput } from 'react-native';
import { Root } from './Root';

it('shows zero point label', () => {
  render(<Root />);

  expect(screen.getByText('Нулевая точка')).toBeVisible();
});

it('shows project sizes label', () => {
  render(<Root />);

  expect(screen.getByText('Проектные размеры')).toBeVisible();
});

it('allows to enter zero point', async () => {
  render(<Root />);

  const input = screen.getByTestId('input-zero-0') as TextInput;
  fireEvent.changeText(input, 100);

  expect(input.props.value).toBe(100);
});

it('allows to enter only integers', () => {
  render(<Root />);

  const input = screen.getByTestId('input-zero-0') as TextInput;
  fireEvent.changeText(input, '');

  expect(input.props.value).toBe('1');
});

it('restrict from entering letters', () => {
  render(<Root />);

  const input = screen.getByTestId('input-zero-0') as TextInput;
  fireEvent.changeText(input, '');

  expect(input.props.value).toBe('1');
});

it('restrict from entering negative value', () => {
  render(<Root />);

  const input = screen.getByTestId('input-zero-0') as TextInput;
  fireEvent.changeText(input, '');

  expect(input.props.value).toBe('1');
});


it.todo('allows to enter project size');
it.todo('calculates difference from zero point to project size');
it.todo('allows to add more project sizes');
it.todo('shows first size position as 0');
it.todo('shows next sizes positions as consecutive integers');