/** Execute the passed callback N times, and return an array of the result of each iteration. */
export function times<T extends unknown>(
  repeat: number,
  iteratee: (index: number) => T,
): T[] {
  if (repeat < 1) {
    return [];
  }
  let index = 0;
  const result = new Array(repeat);
  while (index < repeat) {
    result[index] = iteratee(index);
    index += 1;
  }
  return result;
}
