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
  const sizes = [...store.sizes.map.values()];

  const inputs = sizes.map((size) => {
    return (
      <TextInput
        key={`input-size-${size.id}`}
        testID={`input-size-${size.id}`}
        style={styles.input}
        keyboardType='numeric'
        textAlign='right'
        maxLength={6}
        value={size.value?.toString() || ''}
        onChangeText={text => store.sizes.set(text, size.id)}
      />
    );
  });

  const results = store.results.map(result => {
    return (
      <Text
        key={`result-${result.sizeId}`}
      >
        {result.value}
      </Text>
    );
  });

  const positions = store.results.map(result => {
    return (
      <Text
        key={`result-${result.sizeId}`}
      >
        {result.index}
      </Text>
    );
  });


  return (
    <View style={styles.container}>
      <Text>Нулевая точка</Text>
      <Text>Проектные размеры</Text>
      <TextInput
        testID='input-zero-1'
        style={styles.input}
        keyboardType='numeric'
        value={store.zero.value?.toString() || ''}
        onChangeText={store.setZero}
      />
      <ScrollView>
        {inputs}
      </ScrollView>
      <ScrollView>
        {positions}
      </ScrollView>
      <ScrollView>
        {results}
      </ScrollView>
      <StatusBar style='auto' />
    </View>
  );
});
