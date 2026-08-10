import { StyleSheet, View } from 'react-native';
import { App } from './src';

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function LevelerApp() {
  return (
    <View style={styles.app}>
      <App />
    </View>
  );
}
