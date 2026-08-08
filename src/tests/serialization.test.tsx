import { expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import * as Clipboard from 'expo-clipboard';
import { dedent } from 'ts-dedent';
import { Root } from '../Root';

it('copies table to clipboard', async () => {
  render(<Root />);

  jest.spyOn(Clipboard, 'setStringAsync');

  fireEvent.press(screen.getByTestId('add-size'));
  fireEvent.press(screen.getByTestId('add-size'));
  fireEvent.changeText(screen.getByTestId('input-zero-0'), '500');
  fireEvent.changeText(screen.getByTestId('input-size-0'), '300');
  fireEvent.changeText(screen.getByTestId('input-size-1'), '125');

  fireEvent.press(screen.getByTestId('copy-to-clipboard'));

  expect(Clipboard.setStringAsync).toHaveBeenCalledWith(dedent`
    Шаг	Нулевая точка	Проектные значения	Результат
    1	500	300	200
    2	500	125	375
  `);
});

it('use tabs between values in serialized table', () => {
  render(<Root />);

  jest.spyOn(Clipboard, 'setStringAsync');

  fireEvent.press(screen.getByTestId('add-size'));
  fireEvent.changeText(screen.getByTestId('input-zero-0'), '500');
  fireEvent.changeText(screen.getByTestId('input-size-0'), '300');

  fireEvent.press(screen.getByTestId('copy-to-clipboard'));

  const result: string | undefined =
    // @ts-expect-error mock
    Clipboard.setStringAsync.mock.calls?.[0]?.[0];

  expect(result?.includes('\t')).toBe(true);
});
