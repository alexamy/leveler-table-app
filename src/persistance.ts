import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useRef } from 'react';
import { State, defaultState, recompute } from './reducer';

const STATE_ID = 'leveler-app';

export function useLoadState(machineId = STATE_ID) {
  const [loaded, setLoaded] = useState<{ state?: State; isLoading: boolean }>({
    isLoading: true,
  });

  useEffect(() => {
    async function load() {
      setLoaded({ state: await read(machineId), isLoading: false });
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

// a read that throws is no different from an empty one: the app opens on
// defaults and saves over whatever is there
async function read(machineId: string): Promise<State | undefined> {
  try {
    const data = await AsyncStorage.getItem(machineId);
    return data ? restore(JSON.parse(data)) : undefined;
  } catch {
    return undefined;
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
