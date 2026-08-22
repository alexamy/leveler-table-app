import { StyleSheet } from 'react-native';
import { Input } from '@rneui/themed';
import { View } from 'react-native';
import { getNumberColor } from './helpers';
import { useAppState } from '../context';

export function Step() {
  const [state, dispatch] = useAppState();
  const value = state.step;

  return (
    <View style={styles.headRow}>
      <Input
        testID='input-step'
        keyboardType='numeric'
        textAlign='right'
        placeholder='Шаг'
        value={value}
        style={{ color: getNumberColor(value) }}
        onChangeText={(text) => dispatch({ type: 'change step', value: text })}
      />
    </View>
  );
}

export function Zero() {
  const [state, dispatch] = useAppState();
  const value = state.zero;

  return (
    <View style={styles.headRow}>
      <Input
        testID='input-zero-0'
        keyboardType='numeric'
        textAlign='right'
        placeholder='Нулевая точка'
        value={value}
        style={{ color: getNumberColor(value) }}
        onChangeText={(text) =>
          dispatch({ type: 'change zero point', value: text })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headRow: {
    flexDirection: 'row',
    maxHeight: 50,
  },
});
