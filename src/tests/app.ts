import { screen } from '@testing-library/react-native';
import { TextInput } from 'react-native';
import { Button } from 'react-native';
import { Text } from 'react-native';

export const app = {
  zero: () => screen.getByTestId('input-zero-0') as TextInput,
  step: () => screen.getByTestId('input-step') as TextInput,
  addSize: () => screen.getByTestId('add-size') as Button,
  measurement: (i: number) => ({
    size: screen.getByTestId(`input-size-${i - 1}`) as TextInput,
    offset: screen.getByTestId(`text-offset-${i - 1}`) as Text,
    delete: screen.getByTestId(`delete-size-${i - 1}`) as Button,
  }),
};
