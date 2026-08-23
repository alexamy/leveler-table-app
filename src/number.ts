// Numeric keyboards offer a comma on a Russian-locale device
export function decimal(value: string): string {
  return value.replace(',', '.');
}

export function parse(value: string): number {
  if (isBlank(value)) return NaN;
  return Number(decimal(value));
}

export function isBlankOrNumber(value: string): boolean {
  return isBlank(value) || !isNaN(parse(value));
}

function isBlank(value: string): boolean {
  return value.trim() === '';
}
