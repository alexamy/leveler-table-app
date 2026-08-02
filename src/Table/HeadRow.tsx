import { StyleSheet } from 'react-native';
import { Input } from '@rneui/themed';
import { View } from 'react-native';
import { MachineContext } from '../MachineContext';
import { getNumberColor } from './helpers';

export function Step() {
  const actor = MachineContext.useActorRef();
  const step = MachineContext.useSelector((snapshot) => snapshot.context.step);

  return (
    <View style={styles.headRow}>
      <StepInput
        value={step}
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

function StepInput(props: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  const color = getNumberColor(props.value);

  return (
    <Input
      testID='input-step'
      keyboardType='numeric'
      textAlign='right'
      placeholder='Шаг'
      value={props.value}
      onChangeText={props.onChangeText}
      style={{ color }}
    />
  );
}

export function Zero() {
  const actor = MachineContext.useActorRef();
  const zero = MachineContext.useSelector((snapshot) => snapshot.context.zero);

  return (
    <View style={styles.headRow}>
      <ZeroInput
        value={zero}
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

function ZeroInput(props: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  const color = getNumberColor(props.value);

  return (
    <Input
      testID='input-zero-0'
      keyboardType='numeric'
      textAlign='right'
      placeholder='Нулевая точка'
      value={props.value}
      onChangeText={props.onChangeText}
      style={{ color }}
    />
  );
}

const styles = StyleSheet.create({
  headRow: {
    flexDirection: 'row',
    maxHeight: 50,
  },
});
