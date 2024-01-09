import * as Clipboard from 'expo-clipboard';
import { createActorContext } from '@xstate/react';
import { levelerMachine } from './machine';
import { Platform, ToastAndroid } from 'react-native';

const machine = levelerMachine.provide({
  actions: {
    "copy data to clipboard": (_, { table }) => {
      Clipboard.setStringAsync(table);
    },
    "show copy toast": () => {
      if (Platform.OS !== "android") return;
      ToastAndroid.showWithGravity(
        "Таблица скопирована!",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
    },
  },
});

export const MachineContext = createActorContext(machine);
