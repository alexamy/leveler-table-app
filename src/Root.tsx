import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react-lite';
import { StyleSheet, Text, TextInput, View } from 'react-native';
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
  sizes: [],
});

export const Root = observer(() => {
  return (
    <View style={styles.container}>
      <Text>Нулевая точка</Text>
      <Text>Проектные размеры</Text>
      <TextInput testID='input-zero-0' value={store.zero} onChangeText={store.changeZero} />
      <StatusBar style='auto' />
    </View>
  );
});
