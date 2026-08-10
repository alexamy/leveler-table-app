import { assign, setup } from 'xstate';

type Events =
  | { type: 'change zero point'; value: string }
  | { type: 'change step'; value: string }
  | { type: 'add measurement' }
  | { type: 'remove measurement'; index: number }
  | { type: 'copy data' }
  | { type: 'hold clear data' }
  | { type: 'release clear data' };

interface Measurement {
  size: string;
  offset: string;
}

export type AppContext = {
  zero: string;
  step: string;
  measurements: Measurement[];
};

const initialContext: AppContext = {
  zero: '',
  step: '',
  measurements: [],
};

const config = setup({
  types: {} as {
    events: Events;
    context: AppContext;
  },
  guards: {
    'is filled': ({ context }) =>
      Boolean(context.zero) && Boolean(context.step),
  },
  actions: {
    'copy data to clipboard': (_, params: { context: AppContext }) => {},
    'recalculate measurements': assign({
      measurements({ context }) {
        return context.measurements.reduce<Measurement[]>(
          (measurements) => calcMeasurements({ ...context, measurements }),
          []
        );
      },
    }),
    'add new measurement': assign({
      measurements({ context }) {
        return calcMeasurements(context);
      },
    }),
    'remove last measurement': assign({
      measurements({ context }) {
        return context.measurements.slice(0, -1);
      },
    }),
  },
});

export const levelerMachine = config.createMachine({
  id: 'leveler',
  context: initialContext,
  initial: 'main',
  states: {
    main: {
      on: {
        'hold clear data': 'wait clear data',
      },
    },
    'wait clear data': {
      on: {
        'release clear data': 'main',
      },
      after: {
        1500: {
          target: 'main',
          actions: assign(() => initialContext),
        },
      },
    },
  },
  on: {
    'change zero point': {
      actions: [
        assign({ zero: ({ event }) => event.value }),
        'recalculate measurements',
      ],
    },
    'change step': {
      actions: [
        assign({ step: ({ event }) => event.value }),
        'recalculate measurements',
      ],
    },
    'add measurement': {
      guard: 'is filled',
      actions: 'add new measurement',
    },
    'remove measurement': {
      actions: 'remove last measurement',
    },
    'copy data': {
      actions: [
        {
          type: 'copy data to clipboard',
          params: ({ context }) => ({ context }),
        },
      ],
    },
  },
});

function calcMeasurements({ zero, step, measurements }: AppContext) {
  const start =
    measurements.length > 0 ? measurements[measurements.length - 1].size : zero;

  const size = format(+start + +step);
  const offset = format(+zero - +size);
  const measurement = { size, offset };

  const result = measurements.concat([measurement]);
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
