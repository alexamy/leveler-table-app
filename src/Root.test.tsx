import { expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { Root } from './Root';

it('shows zero point label', () => {
  render(<Root />);

  expect(screen.getByText('Нулевая точка')).toBeVisible();
});

it('shows project sizes label', () => {
  render(<Root />);

  expect(screen.getByText('Проектные размеры')).toBeVisible();
});

it.todo('allows to enter zero point');
it.todo('allows to enter project size');
it.todo('calculates difference from zero point to project size');
it.todo('allows to add more project sizes');
it.todo('shows first size position as 0');
it.todo('shows next sizes positions as consecutive integers');
