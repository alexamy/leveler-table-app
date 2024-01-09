import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { Buttons } from './Buttons';
import { Measurements } from './Measurements';
import { Zero } from './Zero';
import { styles } from './styles';

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
