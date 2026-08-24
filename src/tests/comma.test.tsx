import { expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import * as Clipboard from 'expo-clipboard';
import { dedent } from 'ts-dedent';
import { Root } from '..';
import { app } from './app';
import { defaultState } from '../reducer';

it('reads a comma decimal separator in the zero point', () => {
  render(<Root />);

  fireEvent.changeText(app.zero(), '1,5');
  fireEvent.changeText(app.step(), '1');
  fireEvent.press(app.addSize());

  expect(app.measurement(1).size.props.value).toBe('2.5');
  expect(app.measurement(1).offset.props.children).toBe('-1');
});

it('reads a comma decimal separator in the step', () => {
  render(<Root />);

  fireEvent.changeText(app.zero(), '1');
  fireEvent.changeText(app.step(), '0,5');
  fireEvent.press(app.addSize());

  expect(app.measurement(1).size.props.value).toBe('1.5');
  expect(app.measurement(1).offset.props.children).toBe('-0.5');
});

it('reads a comma decimal separator in a measurement', () => {
  render(
    <Root
      state={{ ...defaultState, mode: 'entered', zero: '0,35', step: '1' }}
    />
  );

  fireEvent.press(app.addSize());
  fireEvent.changeText(app.measurement(1).size, '0,6');

  expect(app.measurement(1).offset.props.children).toBe('-0.25');
});

it('does not highlight a value typed with a comma', () => {
  render(
    <Root
      state={{ ...defaultState, mode: 'entered', zero: '1,5', step: '1' }}
    />
  );

  expect(app.zero().props.style).toMatchObject({ color: '#242424' });

  fireEvent.press(app.addSize());
  fireEvent.changeText(app.measurement(1).size, '2,5');

  expect(app.measurement(1).size.props.style).toMatchObject({
    color: '#242424',
  });
});

it('still highlights a value that is not a number', () => {
  render(<Root state={{ ...defaultState, mode: 'entered', zero: '1,5,5' }} />);

  expect(app.zero().props.style).toMatchObject({ color: '#ff190c' });
});

it('copies one decimal separator into the table', () => {
  render(<Root />);

  jest.spyOn(Clipboard, 'setStringAsync');

  fireEvent.changeText(app.zero(), '1,5');
  fireEvent.changeText(app.step(), '1');
  fireEvent.press(app.addSize());

  fireEvent.press(app.copy());

  expect(Clipboard.setStringAsync).toHaveBeenCalledWith(dedent`
    Шаг	Нулевая точка	Проектные значения	Результат
    1	1.5	-1	2.5
  `);
});
