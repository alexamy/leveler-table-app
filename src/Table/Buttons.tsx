import { Chip } from '@rneui/themed';
import { View } from 'react-native';
import { styles } from './styles';
import { MachineContext } from '../MachineContext';

export function Buttons() {
  const actor = MachineContext.useActorRef();

  return (
    <View style={styles.icons}>
    <Chip
      testID={'copy-to-clipboard'}
      icon={{ name: 'copy', type: 'font-awesome', color: 'white' }}
      containerStyle={styles.bottomIcon}
      onPress={() => actor.send({
        type: "copy data",
      })}
    />
  </View>
  );
}
