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
