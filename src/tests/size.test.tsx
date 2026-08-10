import { expect, it } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Root } from '..';
import { app } from './app';

it('shows first size position as 1', () => {
  render(<Root />);

  fireEvent.changeText(app.zero(), '500');
  fireEvent.changeText(app.step(), '200');
  fireEvent.press(app.addSize());

  expect(screen.queryByText('0')).toBeNull();
  expect(screen.getByText('1')).toBeVisible();
});

it('shows next sizes positions as consecutive integers', () => {
  render(<Root />);

  fireEvent.changeText(app.zero(), '500');
  fireEvent.changeText(app.step(), '200');
  fireEvent.press(app.addSize());
  fireEvent.press(app.addSize());

  expect(screen.getByText('2')).toBeVisible();
});
