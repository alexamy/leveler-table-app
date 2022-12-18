import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Input, Text } from '@rneui/themed';
import { StoreContext } from './store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 40,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  table: {
    alignSelf: 'stretch',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
  },
  position: {
    width: '10%',
    fontSize: 18,
    paddingTop: 7,
  },
  result: {
    fontSize: 18,
    paddingTop: 7,
  },
  input: {
    padding: 0,
    margin: 0,
    flex: 0,
    flexGrow: 0,
    flexShrink: 1,
  },
});

export const Root = observer(function() {
  const store = useContext(StoreContext);
  const sizes = [...store.sizes.map.values()];

  const positions = store.results.map(result => {
    return (
      <Text
        key={`position-${result.sizeId}`}
        style={styles.position}
      >
        {result.index}
      </Text>
    );
  });

  const inputs = sizes.map((size) => {
    return (
      <Input
        key={`input-size-${size.id}`}
        testID={`input-size-${size.id}`}
        keyboardType='numeric'
        textAlign='right'
        maxLength={6}
        value={size.value?.toString() || ''}
        onChangeText={text => store.sizes.set(text, size.id)}
        containerStyle={styles.input}
        style={styles.input}
      />
    );
  });

  const results = store.results.map(result => {
    return (
      <Text
        key={`result-${result.sizeId}`}
        style={styles.result}
      >
        {result.value}
      </Text>
    );
  });

  const groups = sizes.map((size, i) => {
    return (
      <View key={size.id} style={styles.row}>
        {positions[i]}
        {inputs[i]}
        {results[i]}
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <Text>Нулевая точка</Text>
      <Text>Проектные размеры</Text>
      <Input
        testID='input-zero-1'
        keyboardType='numeric'
        textAlign='right'
        value={store.zero.value?.toString() || ''}
        onChangeText={store.setZero}
      />
      <ScrollView style={styles.table}>
        {groups}
      </ScrollView>

      <ScrollView style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.position}>99</Text>
          <Input style={styles.input} containerStyle={styles.input} defaultValue='123' />
          <Text style={styles.result}>123</Text>
        </View>
      </ScrollView>
      <StatusBar style='auto' />
    </View>
  );
});
