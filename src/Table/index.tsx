import { Chip, Input, Text } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'react-native';
import { MachineContext } from '../MachineContext';
import { styles } from './styles';

export function Table() {
  const actor = MachineContext.useActorRef();
  const context = MachineContext.useSelector(
    snapshot => snapshot.context,
  );

  const rows = context.measurements.map((measurement, index) => {
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
          onChangeText={text => actor.send({
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
          disabled={context.measurements.length === 1}
          onPress={() => actor.send({
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
          value={context.zero}
          onChangeText={text => actor.send({
            type: "change zero point",
            value: text,
          })}
        />
        <Chip
          testID={'add-size'}
          onPress={() => actor.send({
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
          onPress={() => actor.send({
            type: "copy data",
          })}
        />
      </View>
      <StatusBar style='auto' />
    </View>
  );
}
