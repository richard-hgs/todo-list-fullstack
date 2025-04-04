

export function splitNumChar(input: string): {
  num: number,
  char: string
} {
  const expression = /^(\d+)([a-zA-Z]+)$/
  const match = input.match(expression);
  if (!match) {
    throw new Error(`Unable to split num char. Invalid input: ${input}`);
  }
  const num = parseInt(match[1], 10);
  const char = match[2];

  return {num, char};
}