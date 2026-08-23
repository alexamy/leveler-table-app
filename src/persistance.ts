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

type Persisted = Omit<State, 'waitingDeletion'>;
type Row = State['measurements'][number];

// waitingDeletion is transient UI state and never reaches storage
function persisted({ mode, zero, step, measurements }: State): Persisted {
  return { mode, zero, step, measurements };
}

// storage is untrusted, and a payload we cannot read whole is not pieced back
// together: the table is small enough to retype
function restore(saved: unknown): State {
  if (!isPersisted(saved)) return defaultState;

  const { mode, zero, step, measurements } = saved;

  // a stored offset can be stale, so derive every row again
  return recompute({ mode, zero, step, measurements, waitingDeletion: false });
}

// fields we do not name are ignored, since nothing reads them
function isPersisted(value: unknown): value is Persisted {
  const { mode, zero, step, measurements } = (value ?? {}) as Persisted;

  return (
    (mode === 'generated' || mode === 'entered') &&
    typeof zero === 'string' &&
    typeof step === 'string' &&
    Array.isArray(measurements) &&
    measurements.every(isRow)
  );
}

function isRow(value: unknown): value is Row {
  const { size, offset } = (value ?? {}) as Row;

  return typeof size === 'string' && typeof offset === 'string';
}
