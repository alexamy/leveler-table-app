import { expect, it } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { Root } from '../Root';
import { app } from './app';

it('updates measurements after zero value change', () => {
  render(<Root />);

  // setup
  fireEvent.changeText(app.zero(), '500');
  fireEvent.changeText(app.step(), '50');

  fireEvent.press(app.addSize());
  const measurement1 = app.measurement(1);
  expect(measurement1.size.props.value).toBe('550');
  expect(measurement1.offset.props.children).toBe('-50');

  fireEvent.press(app.addSize());
  const measurement2 = app.measurement(2);
  expect(measurement2.size.props.value).toBe('600');
  expect(measurement2.offset.props.children).toBe('-100');

  // change
  fireEvent.changeText(app.zero(), '600');

  expect(measurement1.size.props.value).toBe('650');
  expect(measurement1.offset.props.children).toBe('-50');

  expect(measurement2.size.props.value).toBe('700');
  expect(measurement2.offset.props.children).toBe('-100');
});

it('updates measurements after step value change', () => {
  render(<Root />);

  // setup
  fireEvent.changeText(app.zero(), '500');
  fireEvent.changeText(app.step(), '50');

  fireEvent.press(app.addSize());
  const measurement1 = app.measurement(1);
  expect(measurement1.size.props.value).toBe('550');
  expect(measurement1.offset.props.children).toBe('-50');

  fireEvent.press(app.addSize());
  const measurement2 = app.measurement(2);
  expect(measurement2.size.props.value).toBe('600');
  expect(measurement2.offset.props.children).toBe('-100');

  // change
  fireEvent.changeText(app.step(), '100');

  expect(measurement1.size.props.value).toBe('600');
  expect(measurement1.offset.props.children).toBe('-100');

  expect(measurement2.size.props.value).toBe('700');
  expect(measurement2.offset.props.children).toBe('-200');
});

it('disables add button on empty zero size or offset', () => {
  render(<Root />);

  expect(app.addSize().props.accessibilityState?.disabled).toBe(true);

  // only zero size
  fireEvent.changeText(app.zero(), '50');
  fireEvent.changeText(app.step(), '');
  expect(app.addSize().props.accessibilityState?.disabled).toBe(true);

  // only step
  fireEvent.changeText(app.zero(), '');
  fireEvent.changeText(app.step(), '50');
  expect(app.addSize().props.accessibilityState?.disabled).toBe(true);

  // enabled if both entered
  fireEvent.changeText(app.zero(), '500');
  fireEvent.changeText(app.step(), '50');
  expect(app.addSize().props.accessibilityState?.disabled).toBe(false);
});

it('measurement is deleted correctly', () => {
  render(<Root />);

  // setup
  fireEvent.changeText(app.zero(), '500');
  fireEvent.changeText(app.step(), '50');

  fireEvent.press(app.addSize());
  const measurement1 = app.measurement(1);
  expect(measurement1.size.props.value).toBe('550');
  expect(measurement1.offset.props.children).toBe('-50');

  fireEvent.press(app.addSize());
  const measurement2 = app.measurement(2);
  expect(measurement2.size.props.value).toBe('600');
  expect(measurement2.offset.props.children).toBe('-100');

  // remove
  fireEvent.press(measurement1.delete);
  expect(measurement1.size.props.value).toBe('550');
  expect(measurement1.offset.props.children).toBe('-50');
});
