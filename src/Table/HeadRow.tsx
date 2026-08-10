import { StyleSheet } from 'react-native';
import { Input } from '@rneui/themed';
import { View } from 'react-native';
import { MachineContext } from '../MachineContext';
import { getNumberColor } from './helpers';

export function Step() {
  const actor = MachineContext.useActorRef();
  const step = MachineContext.useSelector((snapshot) => snapshot.context.step);
  const color = getNumberColor(step);

  return (
    <View style={styles.headRow}>
      <Input
        testID='input-step'
        keyboardType='numeric'
        textAlign='right'
        placeholder='Шаг'
        value={step}
        style={{ color }}
        onChangeText={(text) =>
          actor.send({
            type: 'change step',
            value: text,
          })
        }
      />
    </View>
  );
}

export function Zero() {
  const actor = MachineContext.useActorRef();
  const zero = MachineContext.useSelector((snapshot) => snapshot.context.zero);
  const color = getNumberColor(zero);

  return (
    <View style={styles.headRow}>
      <Input
        testID='input-zero-0'
        keyboardType='numeric'
        textAlign='right'
        placeholder='Нулевая точка'
        value={zero}
        style={{ color }}
        onChangeText={(text) =>
          actor.send({
            type: 'change zero point',
            value: text,
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headRow: {
    flexDirection: 'row',
    maxHeight: 50,
  },
});
