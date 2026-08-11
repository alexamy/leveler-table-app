import { Dispatch } from 'react';

interface Measurement {
  size: string;
  offset: string;
}

export interface State {
  zero: string;
  step: string;
  measurements: Measurement[];
  waitingDeletion: boolean;
}

export type Action =
  | { type: 'add measurement' }
  | { type: 'remove measurement'; index: number }
  | { type: 'change zero point'; value: string }
  | { type: 'change step'; value: string }
  | { type: 'waiting deletion'; value: boolean }
  | { type: 'restore state'; state: State }
  | { type: 'reset state' };

export type UseReducerResult = [State, Dispatch<Action>];

export const defaultState: State = {
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
      const measurements = state.measurements.slice(0, -1);
      return { ...state, measurements };
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
  const zero = parseFloat(state.zero);
  const step = parseFloat(state.step);

  const result = Array(amount)
    .fill(null)
    .map((_, index) => {
      const delta = step * (index + 1);
      const size = format(zero + delta);
      const offset = format(-delta);
      return { size, offset };
    });

  return result;
}

function format(value: number): string {
  if (isNaN(value)) return '';

  const result = value
    .toFixed(2)
    .replace('.00', '')
    .replace(/\.(\d)0$/, '.$1');

  return result;
}
