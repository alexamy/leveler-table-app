import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Buttons } from './Buttons';
import { Measurements } from './Measurements';
import { Text } from '@rneui/themed';
import { MachineContext } from '../MachineContext';
import { Step, Zero } from './HeadRow';

export function Table() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Zero />
        <Step />
        <DeleteIndicator />
        <Measurements />
      </View>

      <View style={styles.buttons}>
        <Buttons />
      </View>

      <StatusBar style='auto' />
    </View>
  );
}

function DeleteIndicator() {
  const waiting = MachineContext.useSelector(
    ({ context }) => context.waitingDeletion
  );

  return (
    waiting && (
      <View style={styles.deleteIndicator}>
        <Text>Удерживай для удаления всех значений </Text>
        <ActivityIndicator size='small' />
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 40,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  content: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  buttons: {
    marginTop: 20,
    marginBottom: 40,
  },
  deleteIndicator: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
});
