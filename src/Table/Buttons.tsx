import { Chip, Icon, Switch } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { useAppState } from '../context';
import { copyTable } from '../serialization';
import { useDelayedAction } from './helpers';

export function Buttons() {
  const [state, dispatch] = useAppState();
  const needsStep = state.mode !== 'entered';
  const canAddMeasurement =
    Boolean(state.zero) && (!needsStep || Boolean(state.step));

  return (
    <View style={styles.icons}>
      <ModeSwitch />
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

function ModeSwitch() {
  const [state, dispatch] = useAppState();

  return (
    <View style={styles.mode}>
      <View testID='mode-icon-generated'>
        <Icon name='android' type='font-awesome' size={20} />
      </View>

      <Switch
        testID='mode-switch'
        value={state.mode === 'entered'}
        onValueChange={(entered) =>
          dispatch({
            type: 'change mode',
            mode: entered ? 'entered' : 'generated',
          })
        }
      />

      <View testID='mode-icon-entered'>
        <Icon name='user' type='font-awesome' size={20} />
      </View>
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
    alignItems: 'center',
  },
  mode: {
    flex: 1.6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 6,
  },
  bottomIcon: {
    flex: 1,
    marginHorizontal: 6,
  },
});
