import * as Clipboard from 'expo-clipboard';
import { State } from './reducer';
import { decimal } from './number';

export function copyTable(state: State) {
  const table = serializeToTable(state);
  Clipboard.setStringAsync(table);
}

function serializeToTable(context: State): string {
  const entered = context.mode === 'entered';

  const headers = [
    entered ? '№' : 'Шаг',
    'Нулевая точка',
    'Проектные значения',
    'Результат',
  ];

  const rows = context.measurements.map((measurement, index) => {
    const value = decimal(measurement.size);
    const [designValue, outcome] = entered
      ? [value, measurement.offset]
      : [measurement.offset, value];

    return [index + 1, decimal(context.zero), designValue, outcome];
  });

  const result = [headers, ...rows].map((strs) => strs.join('	')).join('\n');

  return result;
}
