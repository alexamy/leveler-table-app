import { Dispatch } from 'react';

interface Measurement {
  size: string;
  offset: string;
}

export type Mode = 'generated' | 'entered';

export interface State {
  mode: Mode;
  zero: string;
  step: string;
  measurements: Measurement[];
  waitingDeletion: boolean;
}

export type Action =
  | { type: 'add measurement' }
  | { type: 'remove measurement'; index: number }
  | { type: 'change measurement'; index: number; value: string }
  | { type: 'change mode'; mode: Mode }
  | { type: 'change zero point'; value: string }
  | { type: 'change step'; value: string }
  | { type: 'waiting deletion'; value: boolean }
  | { type: 'restore state'; state: State }
  | { type: 'reset state' };

export type UseReducerResult = [State, Dispatch<Action>];

export const defaultState: State = {
  mode: 'generated',
  zero: '',
  step: '',
  measurements: [],
  waitingDeletion: false,
};

export function appReducer(state: State, action: Action): State {
  const amount = state.measurements.length;

  switch (action.type) {
    case 'add measurement': {
      const measurements = calculateMeasurements(state, amount + 1);
      return { ...state, measurements };
    }
    case 'remove measurement': {
      const remaining = state.measurements.filter(
        (_, index) => index !== action.index
      );
      const newState = { ...state, measurements: remaining };
      const measurements = calculateMeasurements(newState, remaining.length);
      return { ...newState, measurements };
    }
    case 'change measurement': {
      if (state.mode !== 'entered') return state;

      const entered = state.measurements.map((measurement, index) =>
        index === action.index
          ? { ...measurement, size: action.value }
          : measurement
      );
      const newState = { ...state, measurements: entered };
      const measurements = calculateMeasurements(newState, amount);
      return { ...newState, measurements };
    }

    case 'change mode': {
      const newState = { ...state, mode: action.mode };
      const measurements = calculateMeasurements(newState, amount);
      return { ...newState, measurements };
    }
    case 'change step': {
      const newState = { ...state, step: action.value };
      const measurements = calculateMeasurements(newState, amount);
      return { ...newState, measurements };
    }
    case 'change zero point': {
      const newState = { ...state, zero: action.value };
      const measurements = calculateMeasurements(newState, amount);
      return { ...newState, measurements };
    }

    case 'waiting deletion':
      return { ...state, waitingDeletion: action.value };

    case 'restore state':
      return action.state;
    case 'reset state':
      return defaultState;

    default:
      throw new Error(`Unknown action: ${action satisfies never}.`);
  }
}

// logic
function calculateMeasurements(state: State, amount: number) {
  const zero = parse(state.zero);
  const step = parse(state.step);

  const result = Array(amount)
    .fill(null)
    .map((_, index) => {
      const generated = zero + step * (index + 1);
      const typed = state.measurements[index]?.size ?? '';

      const isEntered = state.mode === 'entered';
      const size = isEntered ? typed : format(generated);
      const value = isEntered ? parse(typed) : generated;
      const offset = format(zero - value);

      return { size, offset };
    });

  return result;
}

function parse(value: string): number {
  if (value.trim() === '') return NaN;
  return Number(value);
}

function format(value: number): string {
  if (isNaN(value)) return '';

  const result = value
    .toFixed(2)
    .replace('.00', '')
    .replace(/\.(\d)0$/, '.$1');

  return result;
}
