import { StyleSheet } from 'react-native';
import { Chip } from '@rneui/themed';
import { View } from 'react-native';
import { MachineContext } from '../serialization';
import { useActorRef, useSelector } from '@xstate/react';
import { delayMachine } from '../delayMachine';
import { useMemo } from 'react';

export function Buttons() {
  const actor = MachineContext.useActorRef();
  const canAddMeasurement = useSelector(
    actor,
    ({ context }) => Boolean(context.zero) && Boolean(context.step)
  );

  return (
    <View style={styles.icons}>
      <ClearData />
      <Chip
        testID={'copy-to-clipboard'}
        icon={{ name: 'copy', type: 'font-awesome', color: 'white' }}
        containerStyle={styles.bottomIcon}
        onPress={() => actor.send({ type: 'copy data' })}
      />
      <Chip
        testID='add-size'
        icon={{ name: 'plus', type: 'font-awesome', color: 'white' }}
        containerStyle={styles.bottomIcon}
        onPress={() => actor.send({ type: 'add measurement' })}
        disabled={!canAddMeasurement}
      />
    </View>
  );
}

function ClearData() {
  const app = MachineContext.useActorRef();
  const actor = useDelayedClear();

  const onPressIn = () => {
    app.send({ type: 'waiting clear', state: true });
    actor.send({ type: 'started' });
  };

  const onPressOut = () => {
    app.send({ type: 'waiting clear', state: false });
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
  const app = MachineContext.useActorRef();

  const config = useMemo(() => {
    return delayMachine.provide({
      delays: { 'action delay': 1500 },
      actions: {
        'delayed action': () => app.send({ type: 'clear data' }),
      },
    });
  }, [app]);

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
