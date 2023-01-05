import { Chip, Input, Text } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { IStore, StoreContext } from './store';
import { applySnapshot, onSnapshot } from 'mobx-state-tree';
import base64 from 'react-native-base64';

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

function useMSTLocalStorage(store: IStore, key: string) {
  useEffect(() => {
    async function load() {
      const json = await AsyncStorage.getItem(key);
      if(json) {
        const snapshot = JSON.parse(json);
        applySnapshot(store, snapshot);
      }
    }

    load();

    const dispose = onSnapshot(store, async (newSnapshot) => {
      const json = JSON.stringify(newSnapshot);
      await AsyncStorage.setItem(key, json);
    });

    return dispose;
  }, [store, key]);
}

export const Root = observer(function() {
  const store = useContext(StoreContext);
  const sizes = [...store.sizes.map.values()];

  useMSTLocalStorage(store, '@leveler-app');

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
          color='secondary'
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
