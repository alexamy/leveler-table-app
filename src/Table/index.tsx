import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { Buttons } from './Buttons';
import { Rows } from './Rows';
import { Zero } from './Zero';
import { styles } from './styles';

export function Table() {
  return (
    <View style={styles.container}>
      <Zero />
      <Rows />
      <Buttons />
      <StatusBar style='auto' />
    </View>
  );
}
