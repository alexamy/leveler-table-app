import { Chip } from '@rneui/themed';
import { View } from 'react-native';
import { styles } from './styles';
import { MachineContext } from '../MachineContext';

export function Buttons() {
  const actor = MachineContext.useActorRef();

  return (
    <View style={styles.icons}>
      <Chip
        testID={'clear-data'}
        icon={{ name: 'trash', type: 'font-awesome', color: 'white' }}
        containerStyle={styles.bottomIcon}
        color={'warning'}
        onPressIn={() => actor.send({ type: "hold clear data" })}
        onPressOut={() => actor.send({ type: "release clear data" })}
      />
      <Chip
        testID={'copy-to-clipboard'}
        icon={{ name: 'copy', type: 'font-awesome', color: 'white' }}
        containerStyle={styles.bottomIcon}
        onPress={() => actor.send({ type: "copy data" })}
      />
      <Chip
        testID='add-size'
        icon={{ name: 'plus', type: 'font-awesome', color: 'white' }}
        containerStyle={styles.bottomIcon}
        onPress={() => actor.send({ type: "add measurement" })}
      />
    </View>
  );
}
