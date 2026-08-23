import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useRef } from 'react';
import { State, defaultState, recompute } from './reducer';

const STATE_ID = 'leveler-app';

interface Loaded {
  state?: State;
  isLoading: boolean;
  // a read that failed leaves the stored table intact, so nothing may overwrite it
  failed: boolean;
}

export function useLoadState(machineId = STATE_ID): Loaded {
  const [loaded, setLoaded] = useState<Loaded>({
    isLoading: true,
    failed: false,
  });

  useEffect(() => {
    async function load() {
      const result = await read(machineId);
      setLoaded({ ...result, isLoading: false });
    }
    load();
  }, [machineId]);

  return loaded;
}

export function useSaveState(state: State, machineId = STATE_ID) {
  const saved = useRef(JSON.stringify(persisted(state)));
  const writes = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    // compared by payload, so transient state churn writes nothing
    const payload = JSON.stringify(persisted(state));
    if (saved.current === payload) return;

    // chained so two quick edits cannot land out of order
    writes.current = writes.current
      .then(() => AsyncStorage.setItem(machineId, payload))
      .then(() => {
        saved.current = payload;
      })
      .catch(() => {
        // leave it unsaved so the next change writes again
      });
  }, [machineId, state]);
}

async function read(machineId: string): Promise<Omit<Loaded, 'isLoading'>> {
  let data: string | null;

  try {
    data = await AsyncStorage.getItem(machineId);
  } catch {
    return { failed: true };
  }

  if (!data) return { failed: false };

  try {
    return { state: restore(JSON.parse(data)), failed: false };
  } catch {
    // unusable, so overwriting it loses nothing
    return { failed: false };
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

  // a stored offset can be stale, so derive every row again
  return recompute({
    mode: fields.mode === 'entered' ? 'entered' : 'generated',
    zero: text(fields.zero),
    step: text(fields.step),
    measurements: rows(fields.measurements),
    waitingDeletion: false,
  });
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
