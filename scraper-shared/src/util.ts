export async function mapAwait<TIn, TOut>(
  input: TIn[],
  callback: (input: TIn) => Promise<TOut>
) {
  const output: TOut[] = [];
  for (let i = 0; i < input.length; i++) {
    output.push(await callback(input[i]));
  }
  return output;
}

export async function flatMapAwait<TIn, TOut>(
  input: TIn[],
  callback: (input: TIn) => Promise<TOut[]>
) {
  const output: TOut[] = [];
  for (let i = 0; i < input.length; i++) {
    output.push(...(await callback(input[i])));
  }
  return output;
}

export function filterOutFalsy<T>(a: (T | undefined | null)[]): T[] {
  return a.filter(x => x !== undefined && x !== null) as T[];
}
