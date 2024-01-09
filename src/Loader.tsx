import { levelerMachine } from './machine';
import { useLoadSnapshot } from './persist';
import { View } from 'react-native';
import { Root } from './Root';
import { Skeleton } from '@rneui/themed';

export function Loader() {
  const [snapshot, isLoading] = useLoadSnapshot(levelerMachine.id);

  return (
    isLoading ? <Loading /> : <Root snapshot={snapshot} />
  );
}

function Loading() {
  return (
    <View>
      <Skeleton />
    </View>
  );
}
