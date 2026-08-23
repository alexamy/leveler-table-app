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
  fireEvent.press(app.confirmRegenerate());

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

it('hides the step input in entered mode but keeps its place', () => {
  render(<Root />);

  fireEvent.changeText(app.step(), '50');
  expect(app.step()).toBeVisible();

  fireEvent(app.mode(), 'valueChange', true);

  expect(app.step()).not.toBeVisible();
  expect(app.step().props.editable).toBe(false);
  expect(app.stepSlot().props.pointerEvents).toBe('none');
});

it('keeps the step value across a round trip through entered mode', () => {
  render(<Root />);

  fireEvent.changeText(app.zero(), '500');
  fireEvent.changeText(app.step(), '50');

  fireEvent(app.mode(), 'valueChange', true);
  fireEvent(app.mode(), 'valueChange', false);

  expect(app.step().props.value).toBe('50');
  expect(app.step()).toBeVisible();

  fireEvent.press(app.addSize());
  expect(app.measurement(1).size.props.value).toBe('550');
});

it('adds a row on the zero point alone in entered mode', () => {
  render(<Root state={{ ...defaultState, mode: 'entered' }} />);

  expect(app.addSize().props.accessibilityState?.disabled).toBe(true);

  fireEvent.changeText(app.zero(), '500');

  expect(app.addSize().props.accessibilityState?.disabled).toBe(false);
});

it('still requires both the zero point and the step in generated mode', () => {
  render(<Root />);

  fireEvent.changeText(app.zero(), '500');
  expect(app.addSize().props.accessibilityState?.disabled).toBe(true);

  fireEvent.changeText(app.step(), '50');
  expect(app.addSize().props.accessibilityState?.disabled).toBe(false);
});

it('keeps the hidden step input out of the accessibility tree', () => {
  render(<Root />);

  expect(app.stepSlot().props.accessibilityElementsHidden).toBe(false);

  fireEvent(app.mode(), 'valueChange', true);

  expect(app.stepSlot().props.accessibilityElementsHidden).toBe(true);
  expect(app.stepSlot().props.importantForAccessibility).toBe(
    'no-hide-descendants'
  );
});

function withTypedRow() {
  render(
    <Root
      state={{ ...defaultState, mode: 'entered', zero: '500', step: '50' }}
    />
  );

  fireEvent.press(app.addSize());
  fireEvent.changeText(app.measurement(1).size, '520');
}

it('asks before regenerating typed measurements', () => {
  withTypedRow();

  fireEvent(app.mode(), 'valueChange', false);

  expect(app.regenerateWarning()).toBeVisible();
  expect(app.mode().props.value).toBe(true);
  expect(app.measurement(1).size.props.value).toBe('520');
});

it('regenerates the rows on продолжить', () => {
  withTypedRow();

  fireEvent(app.mode(), 'valueChange', false);
  fireEvent.press(app.confirmRegenerate());

  expect(app.regenerateWarning()).toBeNull();
  expect(app.mode().props.value).toBe(false);
  expect(app.measurement(1).size.props.value).toBe('550');
});

it('leaves the mode and the rows alone on отмена', () => {
  withTypedRow();

  fireEvent(app.mode(), 'valueChange', false);
  fireEvent.press(app.cancelRegenerate());

  expect(app.regenerateWarning()).toBeNull();
  expect(app.mode().props.value).toBe(true);
  expect(app.measurement(1).size.props.value).toBe('520');
  expect(app.measurement(1).offset.props.children).toBe('-20');
});

it('blanks the rows on продолжить with an empty step', () => {
  render(<Root state={{ ...defaultState, mode: 'entered', zero: '500' }} />);

  fireEvent.press(app.addSize());
  fireEvent.changeText(app.measurement(1).size, '520');

  fireEvent(app.mode(), 'valueChange', false);
  fireEvent.press(app.confirmRegenerate());

  expect(app.mode().props.value).toBe(false);
  expect(app.measurement(1).size.props.value).toBe('');
  expect(app.measurement(1).offset.props.children).toBe('');
});

it('asks nothing when there is no typed value to lose', () => {
  render(
    <Root
      state={{ ...defaultState, mode: 'entered', zero: '500', step: '50' }}
    />
  );

  fireEvent(app.mode(), 'valueChange', false);
  expect(app.regenerateWarning()).toBeNull();
  expect(app.mode().props.value).toBe(false);

  fireEvent(app.mode(), 'valueChange', true);
  fireEvent.press(app.addSize());

  fireEvent(app.mode(), 'valueChange', false);
  expect(app.regenerateWarning()).toBeNull();
  expect(app.mode().props.value).toBe(false);
});

it('asks nothing when switching into entered mode', () => {
  render(<Root state={{ ...defaultState, zero: '500', step: '50' }} />);

  fireEvent.press(app.addSize());
  fireEvent(app.mode(), 'valueChange', true);

  expect(app.regenerateWarning()).toBeNull();
  expect(app.mode().props.value).toBe(true);
});

it('does not reopen the warning when the app starts with typed rows', () => {
  render(
    <Root
      state={{
        ...defaultState,
        mode: 'entered',
        zero: '500',
        measurements: [{ size: '520', offset: '-20' }],
      }}
    />
  );

  expect(app.regenerateWarning()).toBeNull();
});
