import { levelerMachine } from './machine';
import { useLoadSnapshot } from './persist';
import { ActivityIndicator, View } from 'react-native';
import { Root } from './Root';

export function Loader() {
  const [snapshot, isLoading] = useLoadSnapshot(levelerMachine.id);

  return (
    isLoading ? <Loading /> : <Root snapshot={snapshot} />
  );
}

function Loading() {
  return (
    <View>
      <ActivityIndicator size="large" />
    </View>
  );
}
