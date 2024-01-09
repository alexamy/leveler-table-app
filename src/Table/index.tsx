import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { Buttons } from './Buttons';
import { Measurments } from './Measurments';
import { Zero } from './Zero';
import { styles } from './styles';

export function Table() {
  return (
    <View style={styles.container}>
      <Zero />
      <Measurments />
      <Buttons />
      <StatusBar style='auto' />
    </View>
  );
}
