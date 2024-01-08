import { Chip, Input, Text } from '@rneui/themed';
import { useActorRef, useSelector } from '@xstate/react';
import * as Clipboard from 'expo-clipboard';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { levelerMachine } from './machine';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export function Root(props: {
  snapshot: any;
  isSnapshotLoaded: boolean;
}) {
  const machine = levelerMachine.provide({
    actions: {
      "copy data to clipboard": (_, { table }) => {
        Clipboard.setStringAsync(table);
      },
    },
  });

  const actor = useActorRef(machine, {
    snapshot: props.snapshot,
  });

  const send = actor.send;
  const snapshot = useSelector(actor, snapshot => snapshot);
  const { zero, measurements } = snapshot.context;

  useEffect(() => {
    async function save() {
      if(!props.isSnapshotLoaded) return;

      await AsyncStorage.setItem(
        levelerMachine.id,
        JSON.stringify(actor.getPersistedSnapshot()),
      );
    }
    save();
  }, [actor, snapshot, props.isSnapshotLoaded]);

  const rows = measurements.map((measurement, index) => {
    return (
      <View key={index} style={styles.row}>
        <Text style={styles.position}>
          {index}
        </Text>
        <Input
          testID={`input-size-${index}`}
          placeholder='Проектный размер'
          keyboardType='numeric'
          textAlign='left'
          maxLength={6}
          containerStyle={styles.input}
          style={styles.input}
          value={measurement.size}
          onChangeText={text => send({
            type: "change measurement",
            value: text,
            index,
          })}
        />
        <Text style={styles.result}>
          {measurement.offset}
        </Text>
        <Chip
          testID={`delete-size-${index}`}
          color='secondary'
          disabled={measurements.length === 1}
          onPress={() => send({
            type: "remove measurement",
            index,
          })}
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
          testID='input-zero-0'
          keyboardType='numeric'
          textAlign='right'
          placeholder='Нулевая точка'
          value={zero}
          onChangeText={text => send({
            type: "change zero point",
            value: text,
          })}
        />
        <Chip
          testID={'add-size'}
          onPress={() => send({
            type: "add measurement",
          })}
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
          containerStyle={styles.bottomIcon}
          onPress={() => send({
            type: "copy data",
          })}
        />
      </View>
      <StatusBar style='auto' />
    </View>
  );
};
