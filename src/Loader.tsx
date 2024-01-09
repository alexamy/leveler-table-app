import { levelerMachine } from './machine';
import { useLoadSnapshot } from './persist';
import { Root } from './Root';
import { View } from 'react-native';

export function Loader() {
  const snapshot = useLoadSnapshot(levelerMachine.id);

  return (
    snapshot === null ? <View /> : <Root snapshot={snapshot} />
  );
}
