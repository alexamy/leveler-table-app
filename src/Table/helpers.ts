import { lightColors } from '@rneui/themed';

export function getNumberColor(value: string): string {
  const isNumber = !isNaN(Number(value));
  const color = isNumber ? lightColors.black : lightColors.error;
  return color;
}
