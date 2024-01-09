import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from '@xstate/react';
import { useState, useEffect } from 'react';
import { AnyActor, AnyActorRef, SnapshotFrom } from 'xstate';

export function useLoadSnapshot(machineId: string): [
  SnapshotFrom<AnyActor>,
  boolean,
] {
  const [snapshot, setSnapshot] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await AsyncStorage.getItem(machineId);
      const persisted = JSON.parse(data || "undefined");
      setSnapshot(persisted);
      setIsLoading(false);
    }
    load();
  }, [machineId]);

  return [snapshot, isLoading];
}

export function useSaveSnapshot(
  machineId: string,
  actor: AnyActorRef,
) {
  const snapshot = useSelector(actor, snapshot => snapshot);

  useEffect(() => {
    async function save() {
      const state = actor.getPersistedSnapshot();
      await AsyncStorage.setItem(
        machineId,
        JSON.stringify(state),
      );
    }

    save();
  }, [snapshot, machineId, actor]);
}
