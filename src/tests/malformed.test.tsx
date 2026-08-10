import { expect, it } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { Root } from '../Root';
import { app } from './app';

it('shows empty measurement on malformed zero value', () => {
  render(<Root />);

  fireEvent.changeText(app.zero(), '500');
  fireEvent.changeText(app.step(), '50');
  fireEvent.press(app.addSize());

  fireEvent.changeText(app.zero(), 'x150');

  const measurement = app.measurement(1);
  expect(measurement.size).toHaveTextContent('');
  expect(measurement.offset).toHaveTextContent('');
});

it('shows empty measurement on malformed step', () => {
  render(<Root />);

  fireEvent.changeText(app.zero(), '500');
  fireEvent.changeText(app.step(), '50');
  fireEvent.press(app.addSize());

  fireEvent.changeText(app.step(), 'x50');

  const measurement = app.measurement(1);

  expect(measurement.size).toHaveTextContent('');
  expect(measurement.offset).toHaveTextContent('');
});
