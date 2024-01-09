import * as Clipboard from 'expo-clipboard';
import { createActorContext } from '@xstate/react';
import { levelerMachine } from './machine';

const machine = levelerMachine.provide({
  actions: {
    "copy data to clipboard": (_, { table }) => {
      Clipboard.setStringAsync(table);
    },
  },
});

export const MachineContext = createActorContext(machine);
