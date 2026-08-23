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
    saved.current = state;

    async function save() {
      await AsyncStorage.setItem(machineId, JSON.stringify(persisted(state)));
    }
    save();
  }, [machineId, state]);
}

async function read(machineId: string): Promise<State | undefined> {
  const data = await AsyncStorage.getItem(machineId);
  if (!data) return undefined;

  try {
    const saved = JSON.parse(data) as Partial<State>;
    return { ...defaultState, ...saved };
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
