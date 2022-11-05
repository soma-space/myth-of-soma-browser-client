/**
 * Number Utility Functions
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
export function pad(num, size) {
  let s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
}
