import { Chip, Input, Text } from '@rneui/themed';
import { ScrollView, View } from 'react-native';
import { MachineContext } from '../MachineContext';
import { getNumberColor } from './helpers';
import { styles } from './styles';

export function Measurements() {
  const actor = MachineContext.useActorRef();
  const measurements = MachineContext.useSelector(
    snapshot => snapshot.context.measurements,
  );

  return (
    <ScrollView style={styles.table}>
      {measurements.map((measurement, index) =>
        <Measurement
          key={index}
          index={index}
          measurement={measurement}
          onChangeText={text => actor.send({
            type: "change measurement",
            value: text,
            index,
          })}
          onPressDelete={() => actor.send({
            type: "remove measurement",
            index,
          })}
        />
      )}
    </ScrollView>
  );
}

function Measurement({
  measurement, index,
  onChangeText,
  onPressDelete,
}: {
  measurement: { size: string; offset: string; },
  index: number,
  onChangeText: (text: string) => void,
  onPressDelete: () => void,
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.position}>
        {index}
      </Text>
      <SizeInput
        testID={`input-size-${index}`}
        value={measurement.size}
        onChangeText={onChangeText}
      />

      <Text testID={`text-offset-${index}`} style={styles.result}>
        {measurement.offset}
      </Text>
      <DeleteChip
        testID={`delete-size-${index}`}
        onPress={onPressDelete}
      />
    </View>
  );
}

function SizeInput(props: {
  testID: string;
  value: string;
  onChangeText: (text: string) => void;
}) {
  const color = getNumberColor(props.value);

  return (
    <Input
      testID={props.testID}
      value={props.value}
      onChangeText={props.onChangeText}
      placeholder='Проектный размер'
      keyboardType='numeric'
      textAlign='left'
      maxLength={6}
      containerStyle={styles.input}
      style={{ ...styles.input, color }}
    />
  );
}

function DeleteChip(props: {
  testID: string;
  onPress: () => void;
}) {
  return (
    <Chip
      testID={props.testID}
      onPress={props.onPress}
    >
      −
    </Chip>
  );
}
