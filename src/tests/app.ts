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
  copy: () => screen.getByTestId('copy-to-clipboard') as Button,
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
  regenerateWarning: () =>
    screen.queryByText('Введённые значения будут пересчитаны.') as Text,
  cancelRegenerate: () => screen.getByTestId('cancel-regenerate') as Button,
  confirmRegenerate: () => screen.getByTestId('confirm-regenerate') as Button,
  clearData: () => screen.getByTestId('clear-data') as Button,
  radar: () => screen.queryByTestId('radar'),
  radarLabel: () => screen.queryByText('Определяем Петрушкина') as Text,
  radarDial: () => screen.queryByTestId('radar-dial'),
  radarScreen: () => screen.getByTestId('radar-screen'),
  pendingDeletion: () =>
    screen.getByText('Удерживай для удаления всех значений') as Text,
};
