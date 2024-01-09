import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { Buttons } from './Buttons';
import { Measurements } from './Measurements';
import { Zero } from './Zero';
import { styles } from './styles';

export function Table() {
  return (
    <View style={styles.container}>
      <Zero />
      <Measurements />
      <Buttons />
      <StatusBar style='auto' />
    </View>
  );
}
