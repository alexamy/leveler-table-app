import { Audio } from 'expo-av';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import SOUND from '../assets/radar-beep.wav';

// the only place that touches audio: it loads the tone, plays it on the
// interval while the app is in front, and releases it on the way out
export function useBeep(intervalMs: number) {
  useEffect(() => {
    let sound: Audio.Sound | undefined;
    let timer: ReturnType<typeof setInterval> | undefined;
    let released = false;

    // a beep that will not play is not worth breaking the screen over
    const play = () => {
      sound?.replayAsync().catch(ignore);
    };

    const start = () => {
      if (timer || !sound) return;
      play();
      timer = setInterval(play, intervalMs);
    };

    const pause = () => {
      clearInterval(timer);
      timer = undefined;
    };

    // the audio mode is left alone, so the iOS silent switch still wins
    Audio.Sound.createAsync(SOUND)
      .then(({ sound: loaded }) => {
        if (released) return loaded.unloadAsync();

        sound = loaded;
        if (AppState.currentState === 'active') start();
      })
      .catch(ignore);

    const subscription = AppState.addEventListener('change', (next) => {
      if (next === 'active') start();
      else pause();
    });

    return () => {
      released = true;
      pause();
      subscription.remove();
      sound?.unloadAsync().catch(ignore);
    };
  }, [intervalMs]);
}

function ignore() {
  return undefined;
}
