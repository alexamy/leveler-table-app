import { levelerMachine } from './machine';
import { useLoadSnapshot } from './persist';
import { View } from 'react-native';
import { Root } from './Root';

export function Loader() {
  const [snapshot, isLoading] = useLoadSnapshot(levelerMachine.id);

  return (
    isLoading ? <View /> : <Root snapshot={snapshot} />
  );
}
