import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useRef } from 'react';
import {
  PersistedMeasurement,
  PersistedState,
  State,
  defaultState,
  recompute,
} from './reducer';

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

  useEffect(() => {
    // compared by payload, so transient state churn writes nothing
    const payload = JSON.stringify(persisted(state));
    if (saved.current === payload) return;

    AsyncStorage.setItem(machineId, payload)
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

function persisted({ mode, zero, step, measurements }: State): PersistedState {
  return {
    mode,
    zero,
    step,
    measurements: measurements.map(({ size, offset }) => ({ size, offset })),
  };
}

// storage is untrusted, and a payload we cannot read whole is not pieced back
// together: the table is small enough to retype
function restore(saved: unknown): State {
  if (!isPersistedState(saved)) return defaultState;

  const { mode, zero, step, measurements } = saved;

  // a stored offset can be stale, so derive every row again
  return recompute({
    mode,
    zero,
    step,
    measurements: measurements.map((stored, index) => ({
      ...stored,
      id: index + 1,
    })),
    waitingDeletion: false,
  });
}

// fields we do not name are ignored, since nothing reads them
function isPersistedState(value: unknown): value is PersistedState {
  const { mode, zero, step, measurements } = (value ?? {}) as PersistedState;

  return (
    (mode === 'generated' || mode === 'entered') &&
    typeof zero === 'string' &&
    typeof step === 'string' &&
    Array.isArray(measurements) &&
    measurements.every(isPersistedMeasurement)
  );
}

function isPersistedMeasurement(value: unknown): value is PersistedMeasurement {
  const { size, offset } = (value ?? {}) as PersistedMeasurement;

  return typeof size === 'string' && typeof offset === 'string';
}
