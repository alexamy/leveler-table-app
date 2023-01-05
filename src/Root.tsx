import { Chip, Input, Text } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { StoreContext } from './store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 40,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  table: {
    alignSelf: 'stretch',
    width: '100%',
    flexGrow: 0,
  },
  headRow: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
  },
  position: {
    width: '5%',
    fontSize: 18,
    textAlign: 'center',
    paddingTop: 7,
  },
  result: {
    width: '20%',
    fontSize: 18,
    textAlign: 'right',
    paddingTop: 7,
    marginRight: 10,
  },
  input: {
    padding: 0,
    margin: 0,
    flex: 0,
    flexGrow: 0,
    flexShrink: 1,
  },
  icons: {
    flexDirection: 'row',
  },
  bottomIcon: {
    marginHorizontal: 10,
  },
});

export const Root = observer(function() {
  const store = useContext(StoreContext);
  const sizes = [...store.sizes.map.values()];

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
          textAlign='left'
          maxLength={6}
          value={size.value?.toString() || ''}
          onChangeText={text => store.sizes.set(text, size.id)}
          containerStyle={styles.input}
          style={styles.input}
        />
        <Text style={styles.result}>
          {store.results[i].value}
        </Text>
        <Chip
          testID={`delete-size-${size.id}`}
          disabled={store.sizes.map.size === 1}
          onPress={() => store.sizes.remove(size.id)}
        >
          −
        </Chip>
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.headRow}>
        <Input
          testID='input-zero-1'
          keyboardType='numeric'
          textAlign='right'
          placeholder='Нулевая точка'
          value={store.zero.value?.toString() || ''}
          onChangeText={store.setZero}
        />
        <Chip
          testID={'add-size'}
          onPress={() => store.sizes.add()}
        >
          +
        </Chip>
      </View>
      <ScrollView style={styles.table}>
        {rows}
      </ScrollView>

      <View style={styles.icons}>
        <Chip
          testID={'copy-to-clipboard'}
          icon={{ name: 'copy', type: 'font-awesome', color: 'white' }}
          onPress={async () => { await Clipboard.setStringAsync(store.asString); }}
          containerStyle={styles.bottomIcon}
        />
      </View>
      <StatusBar style='auto' />
    </View>
  );
});
