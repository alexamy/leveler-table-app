import { StyleSheet, View } from 'react-native';
import { Loader } from './src/Loader';

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function App() {
  return (
    <View style={styles.app}>
      <Loader />
    </View>
  );
}
