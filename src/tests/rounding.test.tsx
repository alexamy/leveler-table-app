import { expect, it } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { Root } from '..';
import { app } from './app';

it('rounds offset to 2 decimal places', () => {
  render(<Root />);

  fireEvent.changeText(app.zero(), '0.35');
  fireEvent.changeText(app.step(), '0.25');
  fireEvent.press(app.addSize());

  const measurement = app.measurement(1);
  expect(measurement.size.props.value).toMatch(/0\.6$/);
  expect(measurement.offset.props.children).toMatch(/-0\.25$/);
});

it('rounds offset to 1 decimal places', () => {
  render(<Root />);

  fireEvent.changeText(app.zero(), '0.3');
  fireEvent.changeText(app.step(), '0.2');
  fireEvent.press(app.addSize());

  const measurement = app.measurement(1);
  expect(measurement.size.props.value).toMatch(/0\.5$/);
  expect(measurement.offset.props.children).toMatch(/-0\.2$/);
});

it('doesnt round offset for integers', () => {
  render(<Root />);

  fireEvent.changeText(app.zero(), '2');
  fireEvent.changeText(app.step(), '1');
  fireEvent.press(app.addSize());

  const measurement = app.measurement(1);
  expect(measurement.size.props.value).toMatch(/3$/);
  expect(measurement.offset.props.children).toMatch(/-1$/);
});
