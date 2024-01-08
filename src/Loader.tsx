import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { levelerMachine } from './machine';
import { Root } from './Root';
import { View } from 'react-native';

export function Loader() {
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await AsyncStorage.getItem(
        levelerMachine.id,
      );
      const persisted = JSON.parse(data || "undefined");
      setSnapshot(persisted);
    }
    load();
  }, []);

  return (
    snapshot === null ? <View /> : <Root snapshot={snapshot} />
  );
}
