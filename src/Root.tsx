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
  scrollView: {
  },
  rowView: {
    flexDirection: 'row',
  },
});

export const Root = observer(function() {
  const store = useContext(StoreContext);
  const sizes = [...store.sizes.map.values()];

  const positions = store.results.map(result => {
    return (
      <Text
        key={`position-${result.sizeId}`}
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

  const groups = sizes.map((size, i) => {
    return (
      <View key={size.id} style={styles.rowView}>
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
      <ScrollView>
        {groups}
      </ScrollView>
      <StatusBar style='auto' />
    </View>
  );
});
