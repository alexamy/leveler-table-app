import { assign, setup } from "xstate";

type Events =
| { type: "change zero point", value: string }
| { type: "add measurement" }
| { type: "remove measurement", index: number }
| { type: "change measurement", index: number, value: string }
| { type: "copy data" }

type Context = {
  zero: string;
  measurements: Array<{ size: string, offset: string }>;
}

export const levelerMachine = setup({
  types: {} as {
    events: Events,
    context: Context,
  },
  actions: {
    "copy data to clipboard": (_, params: { data: string }) => {},
  },
}).createMachine({
  context: {
    zero: "",
    measurements: [],
    offsets: [],
  },
  on: {
    "change zero point": {
      actions: assign(({ context, event }) => {
        const zero = event.value;
        const measurements = context.measurements.map(({ size }) => {
          const difference = Number(zero) - Number(size);
          const offset = isNaN(difference) ? "" : difference.toString();
          return { size, offset };
        });
        return { zero, measurements };
      }),
    },
    "add measurement": {
      actions: assign({
        measurements({ context }) {
          return context.measurements.concat([
            { size: "", offset: "" },
          ]);
        },
      }),
    },
    "remove measurement": {
      actions: assign({
        measurements({ context, event }) {
          const measurements = context.measurements.slice();
          measurements.splice(event.index, 1);
          return measurements;
        },
      }),
    },
    "change measurement": {
      actions: assign({
        measurements({ context, event }) {
          const measurements = context.measurements.slice();
          const measurement = measurements[event.index];
          measurement.size = event.value;

          const difference = Number(context.zero) - Number(measurement.size);
          const offset = isNaN(difference) ? "" : difference.toString();
          measurement.offset = offset;
          return measurements;
        },
      }),
    },
    "copy data": {
      actions: {
        type: "copy data to clipboard",
        params: ({ context }) => ({
          data: serializeToTable(context),
        }),
      },
    },
  },
});

function serializeToTable(context: Context): string {
  const headers = [
    'Шаг',
    'Нулевая точка',
    'Проектные значения',
    'Результат',
  ];

  const sizes = context.measurements.map((measurement, index) => {
    return [
      index,
      context.zero,
      measurement.size,
      measurement.offset,
    ];
  });

  const result = [headers, ...sizes]
    .map(strs => strs.join('	'))
    .join('\n');

  return result;
}
