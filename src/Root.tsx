import { levelerMachine } from './machine';
import { SnapshotFrom } from 'xstate';
import { Table } from './Table';
import { MachineContext } from './MachineContext';

export function Root({ snapshot }: {
  snapshot?: SnapshotFrom<typeof levelerMachine>,
}) {
  return (
    <MachineContext.Provider options={{ snapshot }}>
      <Table />
    </MachineContext.Provider>
  );
}
