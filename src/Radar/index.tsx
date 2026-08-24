import { StatusBar } from 'expo-status-bar';
import { Modal, Pressable, StyleSheet } from 'react-native';
import { useAppState } from '../context';

export function Radar() {
  const [state, dispatch] = useAppState();
  const close = () => dispatch({ type: 'radar', value: false });

  return (
    <Modal
      testID='radar-screen'
      visible={state.radar}
      animationType='fade'
      statusBarTranslucent
      onRequestClose={close}
    >
      <StatusBar hidden />
      <Pressable testID='radar' style={styles.screen} onPress={close} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
