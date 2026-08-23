import { Dispatch } from 'react';
import { parse } from './number';

export interface Measurement {
  // identity, not Position: a row keeps it while rows above are removed
  id: number;
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
  | { type: 'remove measurement'; id: number }
  | { type: 'change measurement'; id: number; value: string }
  | { type: 'change mode'; mode: Mode }
  | { type: 'change zero point'; value: string }
  | { type: 'change step'; value: string }
  | { type: 'waiting deletion'; value: boolean }
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
  switch (action.type) {
    case 'add measurement': {
      const added = { id: nextId(state.measurements), size: '', offset: '' };
      return recompute({
        ...state,
        measurements: [...state.measurements, added],
      });
    }
    case 'remove measurement': {
      const remaining = state.measurements.filter(({ id }) => id !== action.id);
      return recompute({ ...state, measurements: remaining });
    }
    case 'change measurement': {
      if (state.mode !== 'entered') return state;

      const entered = state.measurements.map((measurement) =>
        measurement.id === action.id
          ? { ...measurement, size: action.value }
          : measurement
      );
      return recompute({ ...state, measurements: entered });
    }

    case 'change mode':
      return recompute({ ...state, mode: action.mode });
    case 'change step':
      return recompute({ ...state, step: action.value });
    case 'change zero point':
      return recompute({ ...state, zero: action.value });

    case 'waiting deletion':
      return { ...state, waitingDeletion: action.value };

    case 'reset state':
      return { ...defaultState, mode: state.mode };

    default:
      throw new Error(`Unknown action: ${action satisfies never}.`);
  }
}

export function recompute(state: State): State {
  return { ...state, measurements: calculateMeasurements(state) };
}

// unique within the array, and rising, so a removal cannot free an id
function nextId(measurements: Measurement[]): number {
  return Math.max(0, ...measurements.map(({ id }) => id)) + 1;
}

// logic
function calculateMeasurements(state: State): Measurement[] {
  const zero = parse(state.zero);
  const step = parse(state.step);

  return state.measurements.map((measurement, index) => {
    const generated = zero + step * (index + 1);

    const isEntered = state.mode === 'entered';
    const size = isEntered ? measurement.size : format(generated);
    const value = isEntered ? parse(measurement.size) : generated;
    const offset = format(zero - value);

    return { ...measurement, size, offset };
  });
}

function format(value: number): string {
  if (isNaN(value)) return '';

  const rounded = Number(value.toFixed(2)) || 0;
  const result = rounded
    .toFixed(2)
    .replace('.00', '')
    .replace(/\.(\d)0$/, '.$1');

  return result;
}
