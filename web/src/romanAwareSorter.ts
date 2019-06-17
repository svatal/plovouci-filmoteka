const lookup: { [key: string]: number } = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000
};
const romanValidator = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/i;
const arabicValidator = /^\(?[\d]+/;

export function compare(a: string, b: string): number {
  return getValue(a).localeCompare(getValue(b));
}

function getValue(s: string): string {
  const words = s.split(" ");
  return words
    .map(w =>
      romanValidator.test(w)
        ? romanToNumber(w)
        : arabicValidator.test(w)
        ? arabicToNumber(w)
        : w
    )
    .join(" ");
}

function romanToNumber(word: string): string {
  const letters = word.toUpperCase().split("");
  let num = 0;
  while (letters.length) {
    const val = lookup[letters.shift()];
    num += val < lookup[letters[0]] ? -val : val;
  }
  return leftPad(num.toString(), 7);
}

function leftPad(s: string, length: number): string {
  while (s.length < length) s = "0" + s;
  return s;
}

function arabicToNumber(word: string): string {
  let prefix = "";
  if (word[0] == "(") {
    prefix = word[0];
    word = word.substr(1);
  }
  const number = parseInt(word).toString();
  return prefix + leftPad(number, 7) + word.substr(number.length);
}
