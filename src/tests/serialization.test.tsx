import { expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import * as Clipboard from 'expo-clipboard';
import { dedent } from 'ts-dedent';
import { Root } from '..';
import { app } from './app';
import { defaultState } from '../reducer';

it('copies table to clipboard', async () => {
  render(<Root />);

  jest.spyOn(Clipboard, 'setStringAsync');

  fireEvent.changeText(app.zero(), '500');
  fireEvent.changeText(app.step(), '200');
  fireEvent.press(app.addSize());
  fireEvent.press(app.addSize());
  fireEvent.press(app.addSize());

  fireEvent.press(app.copy());

  expect(Clipboard.setStringAsync).toHaveBeenCalledWith(dedent`
    Шаг	Нулевая точка	Проектные значения	Результат
    1	500	-200	700
    2	500	-400	900
    3	500	-600	1100
  `);
});

it('use tabs between values in serialized table', () => {
  render(<Root />);

  jest.spyOn(Clipboard, 'setStringAsync');

  fireEvent.changeText(app.zero(), '500');
  fireEvent.changeText(app.step(), '200');
  fireEvent.press(app.addSize());

  fireEvent.press(app.copy());

  const result: string | undefined =
    // @ts-expect-error mock
    Clipboard.setStringAsync.mock.calls?.[0]?.[0];

  expect(result?.includes('\t')).toBe(true);
});

it('copies the entered mode table with its own header and column order', () => {
  render(<Root state={{ ...defaultState, mode: 'entered', zero: '500' }} />);

  jest.spyOn(Clipboard, 'setStringAsync');

  fireEvent.press(app.addSize());
  fireEvent.press(app.addSize());
  fireEvent.changeText(app.measurement(1).size, '612');
  fireEvent.changeText(app.measurement(2).size, '530');

  fireEvent.press(app.copy());

  expect(Clipboard.setStringAsync).toHaveBeenCalledWith(dedent`
    №	Нулевая точка	Проектные значения	Результат
    1	500	612	-112
    2	500	530	-30
  `);
});

it('copies the generated table again after flipping back out of entered mode', () => {
  render(
    <Root
      state={{ ...defaultState, mode: 'entered', zero: '500', step: '200' }}
    />
  );

  jest.spyOn(Clipboard, 'setStringAsync');

  fireEvent.press(app.addSize());
  fireEvent.press(app.addSize());

  fireEvent(app.mode(), 'valueChange', false);
  fireEvent.press(app.copy());

  expect(Clipboard.setStringAsync).toHaveBeenCalledWith(dedent`
    Шаг	Нулевая точка	Проектные значения	Результат
    1	500	-200	700
    2	500	-400	900
  `);
});

it('copies the table for the mode selected at the time of the copy', () => {
  render(<Root />);

  jest.spyOn(Clipboard, 'setStringAsync');

  fireEvent.changeText(app.zero(), '500');
  fireEvent.changeText(app.step(), '200');
  fireEvent.press(app.addSize());
  fireEvent.press(app.addSize());

  fireEvent(app.mode(), 'valueChange', true);
  fireEvent.press(app.copy());

  expect(Clipboard.setStringAsync).toHaveBeenCalledWith(dedent`
    №	Нулевая точка	Проектные значения	Результат
    1	500	700	-200
    2	500	900	-400
  `);
});
