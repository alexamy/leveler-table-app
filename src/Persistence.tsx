import { MachineContext } from './MachineContext';
import { levelerMachine } from './machine';
import { useSaveSnapshot } from './persist';

export function Persistence({ children }: { children: JSX.Element }) {
  const actor = MachineContext.useActorRef();
  useSaveSnapshot(levelerMachine.id, actor);

  return <>{children}</>;
}
