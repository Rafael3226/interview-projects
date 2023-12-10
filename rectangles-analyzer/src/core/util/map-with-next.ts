export default function mapWithNext<T, U>(
  list: T[],
  callback: (arg0: T, arg1: T) => U
): U[] {
  return list.map((e, i, l) => callback(e, list[(i + 1) % l.length]));
}
