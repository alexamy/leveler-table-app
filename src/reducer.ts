interface Measurement {
  size: string;
  offset: string;
}

interface State {
  zero: string;
  step: string;
  measurements: Measurement[];
  waitingDeletion: boolean;
}

type Action =
  | { type: 'add measurement' }
  | { type: 'remove measurement'; index: number }
  | { type: 'change zero point'; value: string }
  | { type: 'change step'; value: string }
  | { type: 'change clear flag'; value: boolean }
  | { type: 'clear state'; state?: State };

const initialState: State = {
  zero: '',
  step: '',
  measurements: [],
  waitingDeletion: false,
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add measurement': {
      const amount = state.measurements.length + 1;
      const measurements = calcMeasurements(state, amount);
      return { ...state, measurements };
    }
    case 'remove measurement': {
      const measurements = state.measurements.slice(0, -1);
      return { ...state, measurements };
    }

    case 'change step': {
      const amount = state.measurements.length;
      const newState = { ...state, step: action.value };
      const measurements = calcMeasurements(newState, amount);
      return { ...newState, measurements };
    }
    case 'change zero point': {
      const amount = state.measurements.length;
      const newState = { ...state, zero: action.value };
      const measurements = calcMeasurements(newState, amount);
      return { ...newState, measurements };
    }

    case 'change clear flag':
      return { ...state, waitingDeletion: action.value };

    case 'clear state':
      return action.state ?? initialState;

    default:
      throw new Error(`Unknown action: ${action satisfies never}.`);
  }
}

// logic
function calcMeasurements(state: State, amount: number) {
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
