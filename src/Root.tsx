import { levelerMachine } from './machine';
import { Table } from './Table';
import { MachineContext } from './MachineContext';
import { useLoadSnapshot } from './persist';
import { View } from 'react-native';

export function Root() {
  const [snapshot, isLoading] = useLoadSnapshot(levelerMachine.id);

  return (
    isLoading ? <View /> :
    <MachineContext.Provider options={{ snapshot }}>
      <Table />
    </MachineContext.Provider>
  );
}
