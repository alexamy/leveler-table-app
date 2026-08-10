import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { State } from './reducer';

const STATE_ID = 'leveler-app';

export function useStatePersistance(
  machineId = STATE_ID
): [State | undefined, boolean] {
  const [state, setState] = useState<State>();
  const [isLoading, setIsLoading] = useState(true);

  // load
  useEffect(() => {
    async function load() {
      const data = await AsyncStorage.getItem(machineId);
      const saved = JSON.parse(data || 'false');
      const state = saved === false ? undefined : (saved as State);

      setState(state);
      setIsLoading(false);
    }
    load();
  }, [machineId]);

  // save
  useEffect(() => {
    async function save() {
      const serialized = JSON.stringify(state);
      await AsyncStorage.setItem(machineId, serialized);
    }
    save();
  }, [machineId, state]);

  return [state, isLoading];
}
