import { lightColors } from '@rneui/themed';
import { useEffect, useRef, useState } from 'react';

export function getNumberColor(value: string): string {
  const isNumber = !isNaN(Number(value));
  const color = isNumber ? lightColors.black : lightColors.error;
  return color;
}

export function useDelayedAction(delayMs: number, action: () => void) {
  const timeoutId = useRef<NodeJS.Timeout>();
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (timeoutId.current) clearTimeout(timeoutId.current);
    if (!waiting) return;

    timeoutId.current = setTimeout(action, delayMs);
    return () => clearTimeout(timeoutId.current);
  }, [action, waiting, delayMs]);

  const start = () => setWaiting(true);
  const stop = () => setWaiting(false);

  return [start, stop];
}
