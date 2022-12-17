import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
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
  const [inputText, setInputText] = useState('');

  return (
    <View style={styles.container}>
      <Text>Нулевая точка</Text>
      <Text>Проектные размеры</Text>
      <TextInput testID='input-zero-point' value={inputText} onChangeText={text => setInputText(text)} />
      <Info />
      <StatusBar style='auto' />
    </View>
  );
}
