import { describe, expect, it, jest } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { TextInput } from 'react-native';
import App from '../../App';
import { app } from './app';

it('loads state from local storage', async () => {
  render(<App />);

  await waitFor(() => {
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
  });
});

it('saves state to local storage when the worker changes it', async () => {
  render(<App />);

  await waitFor(() => {
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
  });

  act(() => {
    const input = screen.getByTestId('input-zero-0') as TextInput;
    fireEvent.changeText(input, '100');
  });

  await waitFor(() => {
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'leveler-app',
      expect.stringContaining('"zero":"100"')
    );
  });
});

it('does not write anything before the saved state has loaded', async () => {
  render(<App />);

  await waitFor(() => {
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
  });

  expect(AsyncStorage.setItem).not.toHaveBeenCalled();
});

it('saves the mode when the worker flips the switch', async () => {
  render(<App />);

  await waitFor(() => {
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
  });

  act(() => {
    fireEvent(app.mode(), 'valueChange', true);
  });

  await waitFor(() => {
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'leveler-app',
      expect.stringContaining('"mode":"entered"')
    );
  });
});

it('resets to default state if local storage has malformed state', async () => {
  jest.mocked(AsyncStorage.getItem).mockResolvedValue('{ not json');

  render(<App />);

  await waitFor(() => {
    expect(app.zero().props.value).toBe('');
  });
});

it('does not save the delete-hold indicator', async () => {
  render(<App />);

  await waitFor(() => {
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
  });

  act(() => {
    fireEvent(app.clearData(), 'pressIn');
  });
  await act(async () => {
    fireEvent.changeText(app.zero(), '100');
  });

  expect(AsyncStorage.setItem).toHaveBeenCalledWith(
    'leveler-app',
    expect.stringContaining('"zero":"100"')
  );
  expect(AsyncStorage.setItem).not.toHaveBeenCalledWith(
    'leveler-app',
    expect.stringContaining('waitingDeletion')
  );
});

it('starts on defaults when local storage itself fails', async () => {
  jest.mocked(AsyncStorage.getItem).mockRejectedValue(new Error('disk full'));

  render(<App />);

  await waitFor(() => {
    expect(app.zero().props.value).toBe('');
  });
});

it('does not restore the delete-hold indicator saved by an older build', async () => {
  jest
    .mocked(AsyncStorage.getItem)
    .mockResolvedValue(
      '{"mode":"generated","zero":"500","step":"10","measurements":[],"waitingDeletion":true}'
    );

  render(<App />);

  await waitFor(() => {
    expect(app.zero().props.value).toBe('500');
  });

  expect(screen.queryByText('Удерживай для удаления всех значений')).toBeNull();
});

const complete = {
  mode: 'generated',
  zero: '500',
  step: '10',
  measurements: [{ size: '510', offset: '-10' }],
};

function saved(changes: object): string {
  return JSON.stringify({ ...complete, ...changes });
}

it.each([
  { kind: 'a null measurement list', data: saved({ measurements: null }) },
  {
    kind: 'a measurement list that is not a list',
    data: saved({ measurements: 'x' }),
  },
  { kind: 'a zero point that is not text', data: saved({ zero: 500 }) },
  { kind: 'an unknown mode', data: saved({ mode: 'typed' }) },
  { kind: 'a payload that is not an object', data: '"leveler"' },
  { kind: 'a payload missing a field', data: '{"zero":"500"}' },
  {
    kind: 'a row without its value',
    data: saved({ measurements: [{ offset: '-10' }] }),
  },
  { kind: 'a row that is not an object', data: saved({ measurements: [null] }) },
])('starts on defaults when local storage holds $kind', async ({ data }) => {
  jest.mocked(AsyncStorage.getItem).mockResolvedValue(data);

  render(<App />);

  await waitFor(() => {
    expect(app.zero().props.value).toBe('');
  });

  expect(app.mode().props.value).toBe(false);
  expect(app.measurements()).toHaveLength(0);
});

it('restores the mode across a restart', async () => {
  jest
    .mocked(AsyncStorage.getItem)
    .mockResolvedValue(
      '{"mode":"entered","zero":"","step":"","measurements":[]}'
    );

  render(<App />);

  await waitFor(() => {
    expect(app.mode().props.value).toBe(true);
  });
});

it('recomputes the offsets of restored rows', async () => {
  jest
    .mocked(AsyncStorage.getItem)
    .mockResolvedValue(
      '{"mode":"entered","zero":"500","step":"","measurements":[{"size":"520","offset":"999"}]}'
    );

  render(<App />);

  await waitFor(() => {
    expect(app.measurement(1).size.props.value).toBe('520');
  });

  expect(app.measurement(1).offset.props.children).toBe('-20');
});

it('keeps saving after a failed read', async () => {
  jest.mocked(AsyncStorage.getItem).mockRejectedValue(new Error('io error'));

  render(<App />);

  await waitFor(() => {
    expect(app.zero().props.value).toBe('');
  });

  await act(async () => {
    fireEvent.changeText(app.zero(), '100');
  });

  await waitFor(() => {
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'leveler-app',
      expect.stringContaining('"zero":"100"')
    );
  });
});

it('does not write when the delete hold changes nothing', async () => {
  render(<App />);

  await waitFor(() => {
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
  });

  await act(async () => {
    fireEvent(app.clearData(), 'pressIn');
  });
  await act(async () => {
    fireEvent(app.clearData(), 'pressOut');
  });

  expect(AsyncStorage.setItem).not.toHaveBeenCalled();
});

describe('links', () => {
  it.todo('saves state to a link');
  it.todo('populates state from a link');
  it.todo('dont reset app state if link has malformed state');
});
