import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react-lite';
import { StyleSheet, Text, View } from 'react-native';
import { Store } from './store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 48,
  },
});

const store = Store.create({
  measurments: [
    {
      sizes: [],
      zero: 100,
    },
  ],
});

const Info = observer(() => {
  const { zero, changeZero } = store.measurments[0];
  return (
    <Text onPress={() => changeZero(zero - 1)} style={styles.text}>
      {zero}
    </Text>
  );
});

export function Root() {
  return (
    <View style={styles.container}>
      <Text>Hello!</Text>
      <Info />
      <StatusBar style='auto' />
    </View>
  );
}
