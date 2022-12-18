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
    width: '5%',
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

  const rows = sizes.map((size, i) => {
    return (
      <View key={size.id} style={styles.row}>
        <Text style={styles.position}>
          {store.results[i].index}
        </Text>
        <Input
          testID={`input-size-${size.id}`}
          placeholder='Проектный размер'
          keyboardType='numeric'
          textAlign='right'
          maxLength={6}
          value={size.value?.toString() || ''}
          onChangeText={text => store.sizes.set(text, size.id)}
          containerStyle={styles.input}
          style={styles.input}
        />
        <Text style={styles.result}>
          {store.results[i].value}
        </Text>
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <Input
        testID='input-zero-1'
        keyboardType='numeric'
        textAlign='right'
        placeholder='Нулевая точка'
        value={store.zero.value?.toString() || ''}
        onChangeText={store.setZero}
      />
      <ScrollView style={styles.table}>
        {rows}
      </ScrollView>

      <StatusBar style='auto' />
    </View>
  );
});
