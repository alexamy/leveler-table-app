import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useAppState } from '../context';
import { Dial } from './Dial';

const GREEN = '#00ff66';
const BLINK_MS = 800;
// the native driver is not available on web, and warns when asked for
const NATIVE_DRIVER = Platform.OS !== 'web';

export function Radar() {
  const [state, dispatch] = useAppState();
  const { width, height } = useWindowDimensions();
  const close = () => dispatch({ type: 'radar', value: false });

  // the shorter side, so the dial fits in either orientation
  const size = Math.min(width, height) * 0.7;

  return (
    <Modal
      testID='radar-screen'
      visible={state.radar}
      animationType='fade'
      statusBarTranslucent
      onRequestClose={close}
    >
      <StatusBar hidden />
      <Pressable testID='radar' style={styles.screen} onPress={close}>
        <Dial size={size} />

        <View style={styles.footer}>
          <Label />
        </View>
      </Pressable>
    </Modal>
  );
}

function Label() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.15,
          duration: BLINK_MS,
          useNativeDriver: NATIVE_DRIVER,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: BLINK_MS,
          useNativeDriver: NATIVE_DRIVER,
        }),
      ])
    );

    blink.start();
    return () => blink.stop();
  }, [opacity]);

  return (
    <Animated.Text style={[styles.label, { opacity }]}>
      Определяем Петрушкина
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    // clear of the home indicator and the gesture bar
    paddingBottom: 48,
  },
  label: {
    color: GREEN,
    fontFamily: Platform.select({ ios: 'Courier', default: 'monospace' }),
    fontSize: 16,
    letterSpacing: 1,
  },
});
