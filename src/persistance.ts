import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useRef } from 'react';
import { State, defaultState } from './reducer';

const STATE_ID = 'leveler-app';

export function useLoadState(
  machineId = STATE_ID
): [State | undefined, boolean] {
  const [state, setState] = useState<State>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setState(await read(machineId));
      setIsLoading(false);
    }
    load();
  }, [machineId]);

  return [state, isLoading];
}

export function useSaveState(state: State, machineId = STATE_ID) {
  const saved = useRef(state);

  useEffect(() => {
    if (saved.current === state) return;

    async function save() {
      try {
        await AsyncStorage.setItem(machineId, JSON.stringify(persisted(state)));
        saved.current = state;
      } catch {
        // leave it unsaved so the next change writes again
      }
    }
    save();
  }, [machineId, state]);
}

async function read(machineId: string): Promise<State | undefined> {
  try {
    const data = await AsyncStorage.getItem(machineId);
    if (!data) return undefined;

    return restore(JSON.parse(data));
  } catch {
    return undefined;
  }
}

// waitingDeletion is transient UI state and never reaches storage
function persisted(state: State): Omit<State, 'waitingDeletion'> {
  return {
    mode: state.mode,
    zero: state.zero,
    step: state.step,
    measurements: state.measurements,
  };
}

// storage is untrusted: an older build, a partial write, a hand-edited file
function restore(saved: unknown): State {
  if (typeof saved !== 'object' || saved === null) return defaultState;

  const fields = saved as Record<string, unknown>;

  return {
    mode: fields.mode === 'entered' ? 'entered' : 'generated',
    zero: text(fields.zero),
    step: text(fields.step),
    measurements: rows(fields.measurements),
    waitingDeletion: false,
  };
}

function rows(value: unknown): State['measurements'] {
  if (!Array.isArray(value)) return [];

  return value.map((row) => {
    const fields = (row ?? {}) as Record<string, unknown>;
    return { size: text(fields.size), offset: text(fields.offset) };
  });
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}
