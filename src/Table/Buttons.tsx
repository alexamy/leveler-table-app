import { StyleSheet } from 'react-native';
import { Chip } from '@rneui/themed';
import { View } from 'react-native';
import { delayMachine } from '../delayMachine';
import { useMemo } from 'react';
import { useAppState } from '../context';
import { useActorRef } from '@xstate/react';
import { copyTable } from '../serialization';

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
  const actor = useDelayedClear();

  const onPressIn = () => {
    dispatch({ type: 'change clear flag', value: true });
    actor.send({ type: 'started' });
  };

  const onPressOut = () => {
    dispatch({ type: 'change clear flag', value: false });
    actor.send({ type: 'stopped' });
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

function useDelayedClear() {
  const [_, dispatch] = useAppState();

  const config = useMemo(() => {
    return delayMachine.provide({
      delays: { 'action delay': 1500 },
      actions: {
        'delayed action': () => dispatch({ type: 'reset state' }),
      },
    });
  }, [dispatch]);

  const actor = useActorRef(config);

  return actor;
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
