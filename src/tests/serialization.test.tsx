import { expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import * as Clipboard from 'expo-clipboard';
import { dedent } from 'ts-dedent';
import { Root } from '..';
import { app } from './app';

it('copies table to clipboard', async () => {
  render(<Root />);

  jest.spyOn(Clipboard, 'setStringAsync');

  fireEvent.changeText(app.zero(), '500');
  fireEvent.changeText(app.step(), '200');
  fireEvent.press(app.addSize());
  fireEvent.press(app.addSize());
  fireEvent.press(app.addSize());

  fireEvent.press(screen.getByTestId('copy-to-clipboard'));

  expect(Clipboard.setStringAsync).toHaveBeenCalledWith(dedent`
    Шаг	Нулевая точка	Проектные значения	Результат
    1	500	700	-200
    2	500	900	-400
    3	500	1100	-600
  `);
});

it('use tabs between values in serialized table', () => {
  render(<Root />);

  jest.spyOn(Clipboard, 'setStringAsync');

  fireEvent.changeText(app.zero(), '500');
  fireEvent.changeText(app.step(), '200');
  fireEvent.press(app.addSize());

  fireEvent.press(screen.getByTestId('copy-to-clipboard'));

  const result: string | undefined =
    // @ts-expect-error mock
    Clipboard.setStringAsync.mock.calls?.[0]?.[0];

  expect(result?.includes('\t')).toBe(true);
});
