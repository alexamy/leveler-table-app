import { Input } from '@rneui/themed';
import { View } from 'react-native';
import { styles } from './styles';
import { MachineContext } from '../MachineContext';
import { getNumberColor } from '.';

export function Zero() {
  const actor = MachineContext.useActorRef();
  const zero = MachineContext.useSelector(
    snapshot => snapshot.context.zero,
  );

  return (
    <View style={styles.headRow}>
      <ZeroInput
        value={zero}
        onChangeText={text => actor.send({
          type: "change zero point",
          value: text,
        })}
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
