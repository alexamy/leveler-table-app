import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { Buttons } from './Buttons';
import { Measurements } from './Measurements';
import { Zero } from './Zero';
import { styles } from './styles';
import { Text } from '@rneui/themed';
import { MachineContext } from '../MachineContext';
import { Step } from './Step';

export function Table() {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Zero />
        <Step />
        <DeleteIndicator />
        <Measurements />
      </View>
      <View style={styles.bottom}>
        <Buttons />
      </View>
      <StatusBar style='auto' />
    </View>
  );
}

function DeleteIndicator() {
  const snapshot = MachineContext.useSelector(
    snapshot => snapshot,
  );

  return (
    snapshot.matches("clear data") &&
    <View style={styles.deleteIndicator}>
      <Text>Удаляем... </Text>
      <ActivityIndicator size="small" />
    </View>
  );
}
