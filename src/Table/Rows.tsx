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
        <SizeInput
          testID={`input-size-${index}`}
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
        <DeleteChip
          testID={`delete-size-${index}`}
          disabled={measurements.length === 1}
          onPress={() => actor.send({
            type: "remove measurement",
            index,
          })}
        />
      </View>
    );
  });

  return (
    <ScrollView style={styles.table}>
      {rows}
    </ScrollView>
  );
}

function SizeInput(props: {
  testID: string;
  value: string;
  onChangeText: (text: string) => void;
}) {
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
      style={styles.input}
    />
  );
}

function DeleteChip(props: {
  testID: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Chip
      testID={props.testID}
      disabled={props.disabled}
      onPress={props.onPress}
      color='secondary'
    >
      −
    </Chip>
  );
}
