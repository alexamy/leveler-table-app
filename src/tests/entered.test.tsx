import { expect, it } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { Root } from '..';
import { app } from './app';
import { State, defaultState } from '../reducer';

function entered(over: Partial<State> = {}): State {
  return { ...defaultState, mode: 'entered', ...over };
}

it('shows the offset from the zero point to a typed measurement', () => {
  render(<Root state={entered({ zero: '500', step: '50' })} />);

  fireEvent.press(app.addSize());
  fireEvent.changeText(app.measurement(1).size, '520');

  expect(app.measurement(1).size.props.value).toBe('520');
  expect(app.measurement(1).offset.props.children).toBe('-20');
});

it('shows a positive offset for a measurement above the zero point', () => {
  render(<Root state={entered({ zero: '500', step: '50' })} />);

  fireEvent.press(app.addSize());
  fireEvent.changeText(app.measurement(1).size, '480');

  expect(app.measurement(1).offset.props.children).toBe('20');
});

it('recomputes every offset when the zero point changes', () => {
  render(<Root state={entered({ zero: '500', step: '50' })} />);

  fireEvent.press(app.addSize());
  fireEvent.press(app.addSize());
  fireEvent.changeText(app.measurement(1).size, '520');
  fireEvent.changeText(app.measurement(2).size, '540');

  fireEvent.changeText(app.zero(), '510');

  expect(app.measurement(1).size.props.value).toBe('520');
  expect(app.measurement(1).offset.props.children).toBe('-10');
  expect(app.measurement(2).size.props.value).toBe('540');
  expect(app.measurement(2).offset.props.children).toBe('-30');
});

it('adds an empty row', () => {
  render(<Root state={entered({ zero: '500', step: '50' })} />);

  fireEvent.press(app.addSize());

  expect(app.measurement(1).size.props.value).toBe('');
  expect(app.measurement(1).offset.props.children).toBe('');
});

it('leaves the offset blank while the measurement is empty', () => {
  render(<Root state={entered({ zero: '500', step: '50' })} />);

  fireEvent.press(app.addSize());
  fireEvent.changeText(app.measurement(1).size, '520');
  fireEvent.changeText(app.measurement(1).size, '');

  expect(app.measurement(1).offset.props.children).toBe('');
});

it('leaves the offset blank on a malformed measurement', () => {
  render(<Root state={entered({ zero: '500', step: '50' })} />);

  fireEvent.press(app.addSize());
  fireEvent.changeText(app.measurement(1).size, '52x');

  expect(app.measurement(1).size.props.value).toBe('52x');
  expect(app.measurement(1).offset.props.children).toBe('');
});

it('leaves the offset blank on a malformed zero point', () => {
  render(<Root state={entered({ zero: '500', step: '50' })} />);

  fireEvent.press(app.addSize());
  fireEvent.changeText(app.measurement(1).size, '520');
  fireEvent.changeText(app.zero(), 'x500');

  expect(app.measurement(1).offset.props.children).toBe('');
});

it('highlights a malformed measurement', () => {
  render(<Root state={entered({ zero: '500', step: '50' })} />);

  fireEvent.press(app.addSize());

  fireEvent.changeText(app.measurement(1).size, '520');
  expect(app.measurement(1).size.props.style).toMatchObject({
    color: '#242424',
  });

  fireEvent.changeText(app.measurement(1).size, '52x');
  expect(app.measurement(1).size.props.style).toMatchObject({
    color: '#ff190c',
  });
});

it.each([
  { measurement: '0.6', offset: '-0.25', zero: '0.35', kind: 'two decimals' },
  { measurement: '0.5', offset: '-0.2', zero: '0.3', kind: 'one decimal' },
  { measurement: '3', offset: '-1', zero: '2', kind: 'whole numbers' },
])('rounds the offset to $kind as generated mode does', ({ zero, measurement, offset }) => {
  render(<Root state={entered({ zero, step: '50' })} />);

  fireEvent.press(app.addSize());
  fireEvent.changeText(app.measurement(1).size, measurement);

  expect(app.measurement(1).offset.props.children).toBe(offset);
});

it('does not let the worker type into a row in generated mode', () => {
  render(<Root state={{ ...defaultState, zero: '500', step: '50' }} />);

  fireEvent.press(app.addSize());

  expect(app.measurement(1).size.props.editable).toBe(false);
});

it('leaves the offset blank on a zero point with trailing junk', () => {
  render(<Root state={entered({ zero: '500', step: '50' })} />);

  fireEvent.press(app.addSize());
  fireEvent.changeText(app.measurement(1).size, '520');
  fireEvent.changeText(app.zero(), '500x');

  expect(app.measurement(1).offset.props.children).toBe('');
});

it('reads state saved without a mode as generated', () => {
  const saved = {
    zero: '500',
    step: '50',
    measurements: [],
    waitingDeletion: false,
  } as unknown as State;

  render(<Root state={saved} />);
  fireEvent.press(app.addSize());

  expect(app.measurement(1).size.props.value).toBe('550');
  expect(app.measurement(1).offset.props.children).toBe('-50');
  expect(app.measurement(1).size.props.editable).toBe(false);
});
