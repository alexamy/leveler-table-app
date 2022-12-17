import { expect, it } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { TextInput } from 'react-native';
import App from '../App';

it('shows zero point label', () => {
  render(<App />);

  expect(screen.getByText('Нулевая точка')).toBeVisible();
});

it('shows project sizes label', () => {
  render(<App />);

  expect(screen.getByText('Проектные размеры')).toBeVisible();
});

it('allows to enter zero point', async () => {
  render(<App />);

  const input = screen.getByTestId('input-zero-0') as TextInput;
  fireEvent.changeText(input, '100');

  expect(input.props.value).toBe('100');
});

it('restrict from entering letters', () => {
  render(<App />);

  const input = screen.getByTestId('input-zero-0') as TextInput;
  fireEvent.changeText(input, 'xyz4xyz');

  expect(input.props.value).toBe('4');
});

it('restrict from entering negative value', () => {
  render(<App />);

  const input = screen.getByTestId('input-zero-0') as TextInput;
  fireEvent.changeText(input, '-42');

  expect(input.props.value).toBe('42');
});

it('restrict from entering float value', () => {
  render(<App />);

  const input = screen.getByTestId('input-zero-0') as TextInput;
  fireEvent.changeText(input, '10.5');

  expect(input.props.value).toBe('105');
});


it.todo('allows to enter project size');
it.todo('calculates difference from zero point to project size');
it.todo('allows to add more project sizes');
it.todo('shows first size position as 0');
it.todo('shows next sizes positions as consecutive integers');
