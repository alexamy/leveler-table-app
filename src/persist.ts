import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { ActorRef } from 'xstate';

export function useLoadSnapshot(machineId: string) {
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await AsyncStorage.getItem(machineId);
      const persisted = JSON.parse(data || "undefined");
      setSnapshot(persisted);
    }
    load();
  }, [machineId]);

  return snapshot;
}

export async function saveSnapshot(
  machineId: string,
  actor: ActorRef<any, any>,
) {
  const snapshot = actor.getPersistedSnapshot();
  await AsyncStorage.setItem(
    machineId,
    JSON.stringify(snapshot),
  );
}
