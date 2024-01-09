import { levelerMachine } from './machine';
import { useLoadSnapshot } from './persist';
import { Root } from './Root';
import { View } from 'react-native';

export function Loader() {
  const [snapshot, isLoading] = useLoadSnapshot(levelerMachine.id);

  return (
    isLoading ? <View /> : <Root snapshot={snapshot} />
  );
}
