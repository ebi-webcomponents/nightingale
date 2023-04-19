/**
 * @param {Number} number
 * @param {Number} mod
 * @returns {Number} number - number % mod (the number rounded by its modulo
 *
 * Example:
 *
 * 25 % 5 = 25
 * 26 % 5 = 25
 * 31 % 5 = 30
 */
export function roundMod(number: number, mod: number): number {
  return number - (number % mod);
}
