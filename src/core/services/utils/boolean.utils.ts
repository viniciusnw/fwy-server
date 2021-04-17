export function numberToBoolean(value: number): boolean {
  return value === 1;
}

export function stringToBoolean(value: string): boolean {
  return value === '1';
}

export function booleanToNumber(value: boolean): number {
  return value ? 1 : 0;
}
