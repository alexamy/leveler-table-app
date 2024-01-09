import { SnapshotFrom } from 'xstate';
import { levelerMachine } from './machine';
import { MachineContext } from './MachineContext';
import { Table } from './Table';
import { useSaveSnapshot } from './persist';

function Persistence({ children }: { children: JSX.Element }) {
  const actor = MachineContext.useActorRef();
  useSaveSnapshot(levelerMachine.id, actor);

  return <>{children}</>;
}


export function Root({ snapshot }: {
  snapshot?: SnapshotFrom<typeof levelerMachine>,
}) {
  return (
    <MachineContext.Provider options={{ snapshot }}>
      <Persistence>
        <Table />
      </Persistence>
    </MachineContext.Provider>
  );
}
