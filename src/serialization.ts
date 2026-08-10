import * as Clipboard from 'expo-clipboard';
import { State } from './reducer';

export function copyTable(state: State) {
  const table = serializeToTable(state);
  Clipboard.setStringAsync(table);
}

function serializeToTable(context: State): string {
  const headers = ['Шаг', 'Нулевая точка', 'Проектные значения', 'Результат'];

  const sizes = context.measurements.map((measurement, index) => {
    return [index + 1, context.zero, measurement.size, measurement.offset];
  });

  const result = [headers, ...sizes].map((strs) => strs.join('	')).join('\n');

  return result;
}
