import * as Clipboard from 'expo-clipboard';
import { createActorContext } from '@xstate/react';
import { AppContext, levelerMachine } from './machine';

const machine = levelerMachine.provide({
  actions: {
    'copy data to clipboard': (_, { context }) => {
      const table = serializeToTable(context);
      Clipboard.setStringAsync(table);
    },
  },
});

export const MachineContext = createActorContext(machine);

function serializeToTable(context: AppContext): string {
  const headers = ['Шаг', 'Нулевая точка', 'Проектные значения', 'Результат'];

  const sizes = context.measurements.map((measurement, index) => {
    return [index + 1, context.zero, measurement.size, measurement.offset];
  });

  const result = [headers, ...sizes].map((strs) => strs.join('	')).join('\n');

  return result;
}
