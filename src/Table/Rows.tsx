import { ScrollView, View } from 'react-native';
import { Text, Input, Chip } from '@rneui/themed';
import { MachineContext } from '../MachineContext';
import { styles } from './styles';

export function Rows() {
  const actor = MachineContext.useActorRef();
  const measurements = MachineContext.useSelector(
    snapshot => snapshot.context.measurements,
  );

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
          disabled={measurements.length === 1}
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
    <ScrollView style={styles.table}>
      {rows}
    </ScrollView>
  );
}
