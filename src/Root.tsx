import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StoreContext } from './store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    fontSize: 20,
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
});

export const Root = observer(function() {
  const store = useContext(StoreContext);

  const nextIdx = store.sizes.length;
  const inputs = store.sizes.map((size, idx) => {
    return (
      <TextInput
        key={`input-size-${idx}`}
        testID={`input-size-${idx}`}
        style={styles.input}
        keyboardType='numeric'
        textAlign='right'
        maxLength={6}
        value={size?.toString()}
        onChangeText={text => store.setSize(text, idx)}
      />
    );
  });

  return (
    <View style={styles.container}>
      <Text>Нулевая точка</Text>
      <Text>Проектные размеры</Text>
      <TextInput
        testID='input-zero-0'
        style={styles.input}
        keyboardType='numeric'
        value={store.zero.toString()}
        onChangeText={store.setZero}
      />
      <ScrollView>
        {inputs}
        <TextInput
          testID={`input-size-${nextIdx}`}
          style={styles.input}
          keyboardType='numeric'
          textAlign='right'
          value={store.sizes[nextIdx]?.toString()}
          onChangeText={text => store.setSize(text, nextIdx)}
        />
      </ScrollView>
      <StatusBar style='auto' />
    </View>
  );
});
