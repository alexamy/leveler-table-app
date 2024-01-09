import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { Buttons } from './Buttons';
import { Measurements } from './Measurements';
import { Zero } from './Zero';
import { styles } from './styles';
import { lightColors } from '@rneui/base';

export function Table() {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Zero />
        <Measurements />
      </View>
      <View style={styles.bottom}>
        <Buttons />
      </View>
      <StatusBar style='auto' />
    </View>
  );
}

export function validateNumberInput(value: string): {
  color: string, isNumber: boolean,
} {
  const isNumber = !isNaN(Number(value));
  const color = isNumber ? lightColors.black : lightColors.error;

  return { color, isNumber };
}
