import { levelerMachine } from './machine';
import { Table } from './Table';
import { MachineContext } from './MachineContext';
import { useLoadSnapshot } from './persist';
import { View } from 'react-native';
import { Persistence } from './Persistence';

export function Loader() {
  const [snapshot, isLoading] = useLoadSnapshot(levelerMachine.id);

  return (
    isLoading ? <View /> :
    <MachineContext.Provider options={{ snapshot }}>
      <Persistence>
        <Table />
      </Persistence>
    </MachineContext.Provider>
  );
}
