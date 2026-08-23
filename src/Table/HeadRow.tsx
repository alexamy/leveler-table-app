import { StyleSheet } from 'react-native';
import { Input } from '@rneui/themed';
import { View } from 'react-native';
import { getNumberColor } from './helpers';
import { useAppState } from '../context';

export function Step() {
  const [state, dispatch] = useAppState();
  const value = state.step;

  // kept mounted in entered mode so the rows below do not shift
  const applies = state.mode !== 'entered';

  return (
    <View
      testID='slot-step'
      style={[styles.headRow, applies ? null : styles.hidden]}
      pointerEvents={applies ? 'auto' : 'none'}
      accessibilityElementsHidden={!applies}
      importantForAccessibility={applies ? 'auto' : 'no-hide-descendants'}
    >
      <Input
        testID='input-step'
        keyboardType='numeric'
        textAlign='right'
        placeholder='Шаг'
        value={value}
        disabled={!applies}
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
  hidden: {
    opacity: 0,
  },
});
