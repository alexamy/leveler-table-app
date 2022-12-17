import { StyleSheet, View } from 'react-native';
import { Root } from './src/Root';
import { Store, StoreContext } from './src/store';

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function App() {
  const store = Store.create();

  return (
    <View style={styles.app}>
      <StoreContext.Provider value={store}>
        <Root />
      </StoreContext.Provider>
    </View>
  );
}
