/**
 * Keyboard Input
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
/**
 * Key code constants
 */
const KeyCodes = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  SHIFT: false, // 16
  CTRL: false, // 17
  ALT: false, // 18
  PAUSE: 19,
  CAPSLOCK: 20,
  ESCAPE: 27,
  SPACE: 32,
  PAGEUP: 33,
  PAGEDOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  PRINTSCREEN: 44,
  INSERT: 45,
  DELETE: 46,

  0: 48,
  1: 49,
  2: 50,
  3: 51,
  4: 52,
  5: 53,
  6: 54,
  7: 55,
  8: 56,
  9: 57,

  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,

  NUMPAD0: 96,
  NUMPAD1: 97,
  NUMPAD2: 98,
  NUMPAD3: 99,
  NUMPAD4: 100,
  NUMPAD5: 101,
  NUMPAD6: 102,
  NUMPAD7: 103,
  NUMPAD8: 104,
  NUMPAD9: 105,
  MULTIPLY: 106,
  ADD: 107,
  UBTRACT: 109,
  DECIMAL: 110,
  DIVIDE: 111,

  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,

  NUMLOCK: 144,
  SCROLLLOCK: 145,

  SEMICOLON: 186,
  EQUAL: 187,
  COMMA: 188,
  DASH: 189,
  PERIOD: 190,
  FORWARDSLASH: 191,
  GRAVEACCENT: 192,
  OPENBRACKET: 219,
  BACKSLASH: 220,
  CLOSEBRACKET: 221,
  SINGLEQUOTE: 222
};

$(document).bind('keydown keyup', (event) => {
  // typecast to boolean using !!
  KeyCodes.SHIFT = !!event.shiftKey;
  KeyCodes.CTRL = !!event.ctrlKey;
  KeyCodes.ALT = !!event.altKey;
});

export default KeyCodes;
