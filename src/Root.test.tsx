import { expect, it } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
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

  const input = screen.getByTestId('input-zero-point') as TextInput;
  fireEvent.changeText(input, 100);

  expect(input.props.value).toBe(100);
});

it.todo('allows to enter project size');
it.todo('calculates difference from zero point to project size');
it.todo('allows to add more project sizes');
it.todo('shows first size position as 0');
it.todo('shows next sizes positions as consecutive integers');

it.todo('allows to enter only integers');
it.todo('restrict from entering letters');
it.todo('restrict from entering negative value');
