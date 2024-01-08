import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { levelerMachine } from './machine';
import { Root } from './Root';

export function Loader() {
  const [snapshot, setSnapshot] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await AsyncStorage.getItem(
        levelerMachine.id,
      );
      const persisted = JSON.parse(data || "undefined");
      setSnapshot(persisted);
      setIsLoaded(true);
    }
    load();
  }, []);

  return (
    <Root
      isSnapshotLoaded={isLoaded}
      snapshot={snapshot}
    />
  );
}
