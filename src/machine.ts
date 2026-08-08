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

type Context = {
  zero: string;
  step: string;
  measurements: Measurement[];
};

const initialContext: Context = {
  zero: '',
  step: '',
  measurements: [],
};

const config = setup({
  types: {} as {
    events: Events;
    context: Context;
  },
  guards: {
    'is filled': ({ context }) =>
      Boolean(context.zero) && Boolean(context.step),
  },
  actions: {
    'copy data to clipboard': (_, params: { table: string }) => {},
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
        return context.measurements.slice(-1);
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
          params: ({ context }) => ({
            table: serializeToTable(context),
          }),
        },
      ],
    },
  },
});

function calcMeasurements({ zero, step, measurements }: Context) {
  const start =
    measurements.length > 0 ? measurements[measurements.length - 1].size : zero;

  const size = calculate(start, 'plus', step);
  const offset = calculate(zero, 'minus', size);
  const measurement = { size, offset };

  const result = measurements.concat([measurement]);
  return result;
}

function calculate(left: string, op: 'plus' | 'minus', right: string): string {
  if (left === '' || right === '') return '';

  const results = {
    plus: Number(left) + Number(right),
    minus: Number(left) - Number(right),
  };

  const result = prettyNumber(results[op]);
  return result;
}

function prettyNumber(value: number): string {
  if (isNaN(value)) return '';

  const result = value
    .toFixed(2)
    .replace('.00', '')
    .replace(/\.(\d)0$/, '.$1');

  return result;
}

function serializeToTable(context: Context): string {
  const headers = ['Шаг', 'Нулевая точка', 'Проектные значения', 'Результат'];

  const sizes = context.measurements.map((measurement, index) => {
    return [index + 1, context.zero, measurement.size, measurement.offset];
  });

  const result = [headers, ...sizes].map((strs) => strs.join('	')).join('\n');

  return result;
}
