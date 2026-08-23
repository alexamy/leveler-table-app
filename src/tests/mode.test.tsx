import { expect, it } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { Root } from '..';
import { app } from './app';
import { defaultState } from '../reducer';

it('starts in generated mode', () => {
  render(<Root />);

  expect(app.mode().props.value).toBe(false);
});

it('shows the switch on the entered side when the app starts in entered mode', () => {
  render(<Root state={{ ...defaultState, mode: 'entered' }} />);

  expect(app.mode().props.value).toBe(true);
});

it('keeps the rows and makes them editable when flipped to entered mode', () => {
  render(<Root />);

  fireEvent.changeText(app.zero(), '500');
  fireEvent.changeText(app.step(), '50');
  fireEvent.press(app.addSize());
  fireEvent.press(app.addSize());

  fireEvent(app.mode(), 'valueChange', true);

  expect(app.mode().props.value).toBe(true);
  expect(app.measurement(1).size.props.value).toBe('550');
  expect(app.measurement(2).size.props.value).toBe('600');
  expect(app.measurement(1).size.props.editable).toBe(true);
});

it('regenerates the rows when flipped back to generated mode', () => {
  render(
    <Root
      state={{ ...defaultState, mode: 'entered', zero: '500', step: '50' }}
    />
  );

  fireEvent.press(app.addSize());
  fireEvent.changeText(app.measurement(1).size, '520');

  fireEvent(app.mode(), 'valueChange', false);

  expect(app.mode().props.value).toBe(false);
  expect(app.measurement(1).size.props.value).toBe('550');
  expect(app.measurement(1).offset.props.children).toBe('-50');
  expect(app.measurement(1).size.props.editable).toBe(false);
});

it('marks the generated side with a robot and the entered side with a person', () => {
  render(<Root />);

  expect(app.modeIcon('generated')).toBeVisible();
  expect(app.modeIcon('entered')).toBeVisible();
});
