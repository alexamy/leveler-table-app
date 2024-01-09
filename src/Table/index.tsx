import { Chip, Input } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { MachineContext } from '../MachineContext';
import { styles } from './styles';
import { Rows } from './Rows';
import { Buttons } from './Buttons';

export function Table() {
  const actor = MachineContext.useActorRef();
  const context = MachineContext.useSelector(
    snapshot => snapshot.context,
  );

  return (
    <View style={styles.container}>
      <View style={styles.headRow}>
        <Input
          testID='input-zero-0'
          keyboardType='numeric'
          textAlign='right'
          placeholder='Нулевая точка'
          value={context.zero}
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

      <Rows />
      <Buttons />
      <StatusBar style='auto' />
    </View>
  );
}
