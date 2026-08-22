import { Chip } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { useAppState } from '../context';
import { copyTable } from '../serialization';
import { useDelayedAction } from './helpers';

export function Buttons() {
  const [state, dispatch] = useAppState();
  const canAddMeasurement = Boolean(state.zero) && Boolean(state.step);

  return (
    <View style={styles.icons}>
      <ClearData />
      <Chip
        testID={'copy-to-clipboard'}
        icon={{ name: 'copy', type: 'font-awesome', color: 'white' }}
        containerStyle={styles.bottomIcon}
        onPress={() => copyTable(state)}
      />
      <Chip
        testID='add-size'
        icon={{ name: 'plus', type: 'font-awesome', color: 'white' }}
        containerStyle={styles.bottomIcon}
        onPress={() => dispatch({ type: 'add measurement' })}
        disabled={!canAddMeasurement}
      />
    </View>
  );
}

function ClearData() {
  const [_, dispatch] = useAppState();
  const [start, stop] = useDelayedAction(1500, () =>
    dispatch({ type: 'reset state' })
  );

  const onPressIn = () => {
    start();
    dispatch({ type: 'waiting deletion', value: true });
  };

  const onPressOut = () => {
    stop();
    dispatch({ type: 'waiting deletion', value: false });
  };

  return (
    <Chip
      testID={'clear-data'}
      icon={{ name: 'trash', type: 'font-awesome', color: 'white' }}
      containerStyle={styles.bottomIcon}
      color={'warning'}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    />
  );
}

const styles = StyleSheet.create({
  icons: {
    flexDirection: 'row',
  },
  bottomIcon: {
    width: '25%',
    marginHorizontal: 10,
  },
});
