import { Chip, Input } from '@rneui/themed';
import { View } from 'react-native';
import { styles } from './styles';
import { MachineContext } from '../MachineContext';

export function Zero() {
  const actor = MachineContext.useActorRef();
  const zero = MachineContext.useSelector(
    snapshot => snapshot.context.zero,
  );

  return (
    <View style={styles.headRow}>
      <Input
        testID='input-zero-0'
        keyboardType='numeric'
        textAlign='right'
        placeholder='Нулевая точка'
        value={zero}
        onChangeText={text => actor.send({
          type: "change zero point",
          value: text,
        })}
      />
      <Chip
        testID={'add-size'}
        onPress={() => actor.send({
          type: "add measurement",
        })}
      >
        +
      </Chip>
    </View>
  );
}
