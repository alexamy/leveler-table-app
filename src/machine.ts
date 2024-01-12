import { assign, setup } from "xstate";

type Events =
| { type: "change zero point", value: string }
| { type: "add measurement" }
| { type: "remove measurement", index: number }
| { type: "change measurement", index: number, value: string }
| { type: "copy data" }
| { type: "clear data" }

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
    "copy data to clipboard": (_, params: { table: string }) => {},
  },
}).createMachine({
  id: "leveler",
  context: {
    zero: "",
    measurements: [],
  },
  on: {
    "change zero point": {
      actions: assign(({ context, event }) => {
        const zero = event.value;
        const measurements = context.measurements.map(({ size }) => {
          const offset = calculateOffset(zero, size);
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
          measurement.offset = calculateOffset(context.zero, measurement.size);
          return measurements;
        },
      }),
    },
    "copy data": {
      actions: [{
        type: "copy data to clipboard",
        params: ({ context }) => ({
          table: serializeToTable(context),
        }),
      }],
    },
    "clear data": {
      actions: assign(() => ({
        zero: "",
        measurements: [],
      })),
    },
  },
});

function calculateOffset(zero: string, size: string): string {
  if(zero === "" || size === "") return "";

  const difference = Number(zero) - Number(size);
  if(isNaN(difference)) return "";

  const offset = difference.toFixed(2)
    .replace(".00", "")
    .replace(/\.(\d)0$/, ".$1");

  return offset;
}

function serializeToTable(context: Context): string {
  const headers = [
    'Шаг',
    'Нулевая точка',
    'Проектные значения',
    'Результат',
  ];

  const sizes = context.measurements.map((measurement, index) => {
    return [
      index + 1,
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
