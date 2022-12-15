import { expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { Root } from './Root';

it('renders welcome message', () => {
  render(<Root />);

  const message = 'Hello!';
  expect(screen.getByText(message)).toBeVisible();
});
