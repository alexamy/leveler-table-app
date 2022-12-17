import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { StoreContext } from './store';

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

export const Root = observer(function() {
  const store = useContext(StoreContext);

  return (
    <View style={styles.container}>
      <Text>Нулевая точка</Text>
      <Text>Проектные размеры</Text>
      <TextInput
        testID='input-zero-0'
        keyboardType='numeric'
        value={store.zero.toString()}
        onChangeText={store.setZero}
      />
      <TextInput
        testID='input-size-0'
        keyboardType='numeric'
        value={store.sizes[0]?.toString()}
        onChangeText={text => store.setSize(text, 0)}
      />
      <StatusBar style='auto' />
    </View>
  );
});
