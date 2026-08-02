import { StyleSheet } from 'react-native';
import { Chip, Input, Text } from '@rneui/themed';
import { ScrollView, View } from 'react-native';
import { MachineContext } from '../MachineContext';
import { getNumberColor } from './helpers';

export function Measurements() {
  const actor = MachineContext.useActorRef();
  const measurements = MachineContext.useSelector(
    (snapshot) => snapshot.context.measurements
  );

  return (
    <ScrollView style={styles.table}>
      {measurements.map((measurement, index) => (
        <Measurement
          key={index}
          index={index}
          measurement={measurement}
          onChangeText={(text) =>
            actor.send({
              type: 'change measurement',
              value: text,
              index,
            })
          }
          onPressDelete={() =>
            actor.send({
              type: 'remove measurement',
              index,
            })
          }
        />
      ))}
    </ScrollView>
  );
}

interface MeasurementProps {
  measurement: { size: string; offset: string };
  index: number;
  onChangeText: (text: string) => void;
  onPressDelete: () => void;
}

function Measurement({
  measurement,
  index,
  onChangeText,
  onPressDelete,
}: MeasurementProps) {
  const color = getNumberColor(measurement.size);

  return (
    <View style={styles.row}>
      <Text style={styles.position}>{index + 1}</Text>
      <Input
        testID={`input-size-${index}`}
        value={measurement.size}
        onChangeText={onChangeText}
        placeholder='Проектный размер'
        keyboardType='numeric'
        textAlign='left'
        maxLength={6}
        containerStyle={styles.input}
        style={{ ...styles.input, color }}
      />

      <Text testID={`text-offset-${index}`} style={styles.result}>
        {measurement.offset}
      </Text>

      <Chip testID={`delete-size-${index}`} onPress={onPressDelete}>
        −
      </Chip>
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    alignSelf: 'stretch',
    width: '100%',
    flexGrow: 0,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
  },
  position: {
    width: '8%',
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
    flex: 0,
    flexShrink: 1,
  },
});
