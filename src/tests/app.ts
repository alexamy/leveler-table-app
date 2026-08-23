import { screen } from '@testing-library/react-native';
import { TextInput } from 'react-native';
import { Button } from 'react-native';
import { Text } from 'react-native';

export const app = {
  zero: () => screen.getByTestId('input-zero-0') as TextInput,
  // hidden in entered mode, so queries must reach past the accessibility tree
  step: () =>
    screen.getByTestId('input-step', {
      includeHiddenElements: true,
    }) as TextInput,
  stepSlot: () =>
    screen.getByTestId('slot-step', { includeHiddenElements: true }),
  addSize: () => screen.getByTestId('add-size') as Button,
  measurements: () =>
    screen.queryAllByTestId(/^input-size-\d+$/) as TextInput[],
  measurement: (i: number) => ({
    size: screen.getByTestId(`input-size-${i - 1}`) as TextInput,
    offset: screen.getByTestId(`text-offset-${i - 1}`) as Text,
    delete: screen.getByTestId(`delete-size-${i - 1}`) as Button,
  }),
  mode: () => screen.getByTestId('mode-switch'),
  modeIcon: (mode: 'generated' | 'entered') =>
    screen.getByTestId(`mode-icon-${mode}`),
  clearData: () => screen.getByTestId('clear-data') as Button,
  pendingDeletion: () =>
    screen.getByText('Удерживай для удаления всех значений') as Text,
};
