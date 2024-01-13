import { assign, setup } from "xstate";

type Events =
| { type: "change zero point", value: string }
| { type: "change step", value: string }
| { type: "add measurement" }
| { type: "remove measurement", index: number }
| { type: "change measurement", index: number, value: string }
| { type: "copy data" }
| { type: "press clear data" }
| { type: "release clear data" }

type Context = {
  zero: string;
  step: string;
  measurements: Array<{ size: string, offset: string }>;
}

const initialContext = {
  zero: "",
  step: "",
  measurements: [],
} satisfies Context;

export const levelerMachine = setup({
  types: {} as {
    events: Events,
    context: Context,
  },
  actions: {
    "copy data to clipboard": (_, params: { table: string }) => {},
    "recalculate offsets": assign({
      measurements({ context }) {
        return context.measurements.map(({ size }) => {
          const offset = calculateOffset(context.zero, size);
          return { size, offset };
        });
      },
    }),
  },
}).createMachine({
  id: "leveler",
  context: initialContext,
  initial: "main",
  states: {
    "main": {
      on: {
        "press clear data": "clear data",
      },
    },
    "clear data": {
      on: {
        "release clear data": "main",
      },
      after: {
        1500: {
          target: "main",
          actions: assign(() => initialContext),
        },
      },
    },
  },
  on: {
    "change zero point": {
      actions: [assign({
        zero: ({ event }) => event.value,
      }), "recalculate offsets"],
    },
    "change step": {
      actions: assign({
        step: ({ event }) => event.value,
      }),
    },
    "add measurement": {
      actions: [assign({
        measurements({ context: { measurements, zero, step } }) {
          if(!step) {
            return measurements.concat([
              { size: "", offset: "" },
            ]);
          }

          let start = zero;
          if(measurements.length > 0) {
            const last = measurements[measurements.length - 1];
            start = last.size;
          }

          const size = start
            ? prettyNumber(Number(start) + Number(step))
            : "";

          return measurements.concat([
            { size, offset: "" },
          ]);
        },
      }), "recalculate offsets"],
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
  },
});

function calculateOffset(zero: string, size: string): string {
  if(zero === "" || size === "") return "";

  const difference = Number(zero) - Number(size);
  const result = prettyNumber(difference);
  return result;
}

function prettyNumber(value: number): string {
  if(isNaN(value)) return "";

  const result = value.toFixed(2)
    .replace(".00", "")
    .replace(/\.(\d)0$/, ".$1");

  return result;
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
