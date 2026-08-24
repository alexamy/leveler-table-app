import { lightColors } from '@rneui/themed';
import { useEffect, useRef } from 'react';
import { isBlankOrNumber } from '../number';

export function getNumberColor(value: string): string {
  const color = isBlankOrNumber(value) ? lightColors.black : lightColors.error;
  return color;
}

// stop reports whether it got there first, so a caller can tell a short press
// from one that ran the action
export function useDelayedAction(
  delayMs: number,
  action: () => void
): [() => void, () => boolean] {
  const timeoutId = useRef<NodeJS.Timeout>();

  useEffect(() => () => clearTimeout(timeoutId.current), []);

  const start = () => {
    timeoutId.current = setTimeout(() => {
      timeoutId.current = undefined;
      action();
    }, delayMs);
  };

  const stop = () => {
    const pending = timeoutId.current !== undefined;
    clearTimeout(timeoutId.current);
    timeoutId.current = undefined;
    return pending;
  };

  return [start, stop];
}

// a streak of presses, each within gapMs of the one before
export function useTapStreak(
  taps: number,
  gapMs: number,
  onStreak: () => void
): [() => void, () => void] {
  const counted = useRef(0);
  const timeoutId = useRef<NodeJS.Timeout>();

  useEffect(() => () => clearTimeout(timeoutId.current), []);

  const reset = () => {
    clearTimeout(timeoutId.current);
    counted.current = 0;
  };

  const tap = () => {
    clearTimeout(timeoutId.current);
    counted.current += 1;

    if (counted.current >= taps) {
      counted.current = 0;
      return onStreak();
    }

    timeoutId.current = setTimeout(reset, gapMs);
  };

  return [tap, reset];
}
