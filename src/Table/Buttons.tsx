import { Chip, Dialog, Icon, Switch, Text } from '@rneui/themed';
import { useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { useAppState } from '../context';
import { Mode, recompute } from '../reducer';
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
  // transient, so it never reaches persisted state
  const [asking, setAsking] = useState(false);

  const changeMode = (mode: Mode) => {
    Keyboard.dismiss();
    dispatch({ type: 'change mode', mode });
  };
  // only a row that holds something and would come back different is at risk
  const regenerated = recompute({ ...state, mode: 'generated' }).measurements;
  const wouldOverwrite = state.measurements.some(
    (measurement, index) =>
      measurement.size.trim() !== '' &&
      measurement.size !== regenerated[index].size
  );

  const onValueChange = (entered: boolean) => {
    if (!entered && wouldOverwrite) return setAsking(true);
    changeMode(entered ? 'entered' : 'generated');
  };

  return (
    <View style={styles.mode}>
      <View testID='mode-icon-generated'>
        <Icon name='android' type='font-awesome' size={20} />
      </View>

      <Switch
        testID='mode-switch'
        value={state.mode === 'entered'}
        onValueChange={onValueChange}
      />

      <View testID='mode-icon-entered'>
        <Icon name='user' type='font-awesome' size={20} />
      </View>

      <Dialog isVisible={asking} onBackdropPress={() => setAsking(false)}>
        <Text>Введённые значения будут пересчитаны.</Text>

        <Dialog.Actions>
          <Dialog.Button
            testID='cancel-regenerate'
            title='Отмена'
            onPress={() => setAsking(false)}
          />
          <Dialog.Button
            testID='confirm-regenerate'
            title='Продолжить'
            onPress={() => {
              setAsking(false);
              changeMode('generated');
            }}
          />
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}

function ClearData() {
  const [_, dispatch] = useAppState();
  const [start, stop] = useDelayedAction(1500, () => {
    Keyboard.dismiss();
    dispatch({ type: 'reset state' });
  });

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
