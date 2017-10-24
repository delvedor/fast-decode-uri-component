module.exports = decodeURIComponent;
function decodeURIComponent(string) {
  let k = string.indexOf('%');
  if (k === -1) return string;

  const length = string.length;
  let decoded = '';
  let last = 0;
  let codepoint = 0;
  let startOfOctets = k;
  state = UTF8_ACCEPT;

  while (k > -1 && k < length - 2) {
    codepoint = decode(string, k, codepoint);

    switch (state) {
      case UTF8_ACCEPT:
        decoded += string.substring(last, startOfOctets);

        decoded += (codepoint <= 0xFFFF) ?
          String.fromCharCode(codepoint) :
          String.fromCharCode(
            (0xD7C0 + (codepoint >> 10)),
            (0xDC00 + (codepoint & 0x3FF))
          );

        codepoint = 0;
        last = k + 3;
        k = startOfOctets = string.indexOf('%', last);
        break;
      default:
        k += 3;
        if (k < length && string[k] === '%') break;

        // Intentional fall-through
      case UTF8_REJECT:
        state = UTF8_ACCEPT;
        codepoint = 0;
        k = startOfOctets = string.indexOf('%', k + 1);
        break;
    }
  }

  return decoded + string.substring(last);
}

const HEX = Object.assign(Object.create(null), {
  '0':  0, '1':  1,
  '2':  2, '3':  3,
  '4':  4, '5':  5,
  '6':  6, '7':  7,
  '8':  8, '9':  9,
  'a': 10, 'A': 10,
  'b': 11, 'B': 11,
  'c': 12, 'C': 12,
  'd': 13, 'D': 13,
  'e': 14, 'E': 14,
  'f': 15, 'F': 15,
});
function hexCodeToInt(c, badShift) {
  const i = HEX[c];
  return i === undefined ? 16 << badShift : i;
}


/**
 * The below algorithms are based on Bjoern Hoehrmann's DFA Unicode Decoder.
 * Copyright (c) 2008-2009 Bjoern Hoehrmann <bjoern@hoehrmann.de>
 * See http://bjoern.hoehrmann.de/utf-8/decoder/dfa/ for details.
 */
const UTF8_ACCEPT = 0;
const UTF8_REJECT = 12;
const UTF8_DATA = [
  // The first part of the table maps bytes to character classes that
  // to reduce the size of the transition table and create bitmasks.
   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
   1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,  9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,
   7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,  7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
   8,8,2,2,2,2,2,2,2,2,2,2,2,2,2,2,  2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
  10,3,3,3,3,3,3,3,3,3,3,3,3,4,3,3, 11,6,6,6,5,8,8,8,8,8,8,8,8,8,8,8,
  // Special "bad" byte character classes, at all possible values of (X << 4 | 256) or (256 | Y),
  // where X and Y are 0 <= X <= 15.
  13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13, 13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,
  13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13, 13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,
  13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13, 13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,
  13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13, 13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,
  13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13, 13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,
  13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13, 13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,
  13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13, 13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,
  13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13, 13,

  // The second part is a transition table that maps a combination
  // of a state of the automaton and a character class to a state.
   0,12,24,36,60,96,84,12,12,12,48,72, 12,12,12,12,12,12,12,12,12,12,12,12,
  12, 0,12,12,12,12,12, 0,12, 0,12,12, 12,24,12,12,12,12,12,24,12,24,12,12,
  12,12,12,12,12,12,12,24,12,12,12,12, 12,24,12,12,12,12,12,12,12,24,12,12,
  12,12,12,12,12,12,12,36,12,36,12,12, 12,36,12,12,12,12,12,36,12,36,12,12,
  12,36,12,12,12,12,12,12,12,12,12,12,

  // The third part maps the current character class to a mask that needs
  // to apply to it.
  0x7F, 0x3F, 0x1F, 0x0F, 0x0F, 0x07, 0x07, 0x3F, 0x00, 0x3F, 0x0F, 0x07, 0x00, 0x00,
];

let state = UTF8_ACCEPT;
function decode(string, k, codepoint) {
  const high = hexCodeToInt(string[k + 1], 0);
  const low = hexCodeToInt(string[k + 2], 4);
  const byte = (high << 4) | low;

  const type = UTF8_DATA[byte];
  const mask = UTF8_DATA[605 + type];

  state = UTF8_DATA[497 + state + type];
  return (codepoint << 6) | (byte & mask);
}
