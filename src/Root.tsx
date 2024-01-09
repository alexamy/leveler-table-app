import * as Clipboard from 'expo-clipboard';
import { createActorContext } from '@xstate/react';
import { levelerMachine } from './machine';
import { SnapshotFrom } from 'xstate';
import { Table } from './Table';

const machine = levelerMachine.provide({
  actions: {
    "copy data to clipboard": (_, { table }) => {
      Clipboard.setStringAsync(table);
    },
  },
});

export const MachineContext = createActorContext(machine);

export function Root({ snapshot }: {
  snapshot?: SnapshotFrom<typeof levelerMachine>,
}) {
  return (
    <MachineContext.Provider options={{ snapshot }}>
      <Table />
    </MachineContext.Provider>
  );
}
