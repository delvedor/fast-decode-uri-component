"use strict";

const assert = require('assert');
const decode = require('.');

describe('Safe decodeURIComponent', () => {
  function validCodes(iterator) {
    for (let i = 0, j = 0; i <= 0xFFFF; i++, j++) {
      // This skips the invalid range
      if (i === 0xD800) {
        i = 0xE000;
      }
      const char = String.fromCharCode(i);
      iterator(encodeURIComponent(char), char);
    }
    for (let i = 0x10000; i < 0x10FFFF; i++) {
      const char = String.fromCharCode(0xD7C0 + (i >> 10), 0xDC00 + (i & 0x3FF));
      iterator(encodeURIComponent(char), char);
    }
  }
  function tests(name, implementation) {
    describe(name, () => {
      it('leaves non-encoded strings alone', () => {
        assert.equal(implementation('test'), 'test');
      });

      it('decodes correctly encoded strings', () => {
        validCodes((encoded, original) => {
          assert.equal(implementation(encoded), original);
        });
      });
    });
  }

  tests('js', decode);
});
