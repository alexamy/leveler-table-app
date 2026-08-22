import { StyleSheet } from 'react-native';
import { Chip, Input, Text } from '@rneui/themed';
import { ScrollView, View } from 'react-native';
import { getNumberColor } from './helpers';
import { useAppState } from '../context';

export function Measurements() {
  const [state, dispatch] = useAppState();

  return (
    <ScrollView style={styles.table}>
      {state.measurements.map((measurement, index) => (
        <Measurement
          key={index}
          index={index}
          measurement={measurement}
          editable={state.mode === 'entered'}
          onChangeText={(value) =>
            dispatch({ type: 'change measurement', index, value })
          }
          onPressDelete={() => dispatch({ type: 'remove measurement', index })}
        />
      ))}
    </ScrollView>
  );
}

interface MeasurementProps {
  measurement: { size: string; offset: string };
  index: number;
  editable: boolean;
  onPressDelete: () => void;
  onChangeText: (text: string) => void;
}

function Measurement({
  measurement,
  index,
  editable,
  onChangeText,
  onPressDelete,
}: MeasurementProps) {
  const color = getNumberColor(measurement.size);

  return (
    <View style={styles.row}>
      <Text style={styles.position}>{index + 1}</Text>
      <Input
        disabled={!editable}
        testID={`input-size-${index}`}
        value={measurement.size}
        onChangeText={onChangeText}
        placeholder='Проектный размер'
        keyboardType='numeric'
        textAlign='left'
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
    opacity: 1,
  },
});
