import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export function Root() {
  return (
    <View style={styles.container}>
      <Text>Hello!</Text>
      <StatusBar style='auto' />
    </View>
  );
}
