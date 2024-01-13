import { Input } from '@rneui/themed';
import { View } from 'react-native';
import { styles } from './styles';
import { MachineContext } from '../MachineContext';
import { getNumberColor } from './helpers';

export function Step() {
  const actor = MachineContext.useActorRef();
  const step = MachineContext.useSelector(
    snapshot => snapshot.context.step,
  );

  return (
    <View style={styles.headRow}>
      <StepInput
        value={step}
        onChangeText={text => actor.send({
          type: "change step",
          value: text,
        })}
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
