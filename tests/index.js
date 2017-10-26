"use strict";

const decode = require('..');
const assert = require('assert');
// Lol, I'm running so many tests that mocha broke.
const mocha = require('./mocha');
const describe = mocha.describe;
const it = mocha.it;

describe('Safe decodeURIComponent',() => {

  function validCodes(iterator) {
    for (let i = 0, j = 0; i <= 0xFFFF; i++, j++) {
      // This skips the invalid range
      if (i === 0xD800) {
        i = 0xE000;
      }
      const char = String.fromCharCode(i);
      iterator(char);
    }
  }
  function validSurrogates(iterator) {
    for (let i = 0x10000; i < 0x10FFFF; i++) {
      const char = String.fromCharCode(0xD7C0 + (i >> 10), 0xDC00 + (i & 0x3FF));
      iterator(char);
    }
  }

  function tests(char) {
    describe(char, () => {
      it('decodes correctly encoded chars', () => {
        assert.equal(decode(encodeURIComponent(char)), char);
      });

      it('decodes correctly encoded strings', () => {
        const left = `123${char}`;
        assert.equal(decode(encodeURIComponent(left)), left);

        const right = `${char}123`;
        assert.equal(decode(encodeURIComponent(right)), right);

        const both = `1${char}23`;
        assert.equal(decode(encodeURIComponent(both)), both);
      });

      it('handles incorrectly encoded chars', () => {
        const encoded = encodeURIComponent(char);
        for (let i = 1; i < encoded.length; i++) {
          const rightside = encoded.slice(0, i);
          assert.equal(decode(rightside), rightside);

          const leftside = encoded.slice(i);
          assert.equal(decode(leftside), leftside);
        }
      });

      it('handles incorrectly encoded chars in a string', () => {
        const encoded = encodeURIComponent(char);
        for (let i = 1; i < encoded.length; i++) {
          const rightside = encoded.slice(0, i);
          const leftRightside = `123${rightside}`;
          assert.equal(decode(encodeURIComponent(leftRightside)), leftRightside);

          const rightRightside = `${rightside}123`;
          assert.equal(decode(encodeURIComponent(rightRightside)), rightRightside);

          const bothRightside = `1${rightside}23`;
          assert.equal(decode(encodeURIComponent(bothRightside)), bothRightside);


          const leftside = encoded.slice(i);
          const leftLeftside = `123${leftside}`;
          assert.equal(decode(encodeURIComponent(leftLeftside)), leftLeftside);

          const rightLeftside = `${leftside}123`;
          assert.equal(decode(encodeURIComponent(rightLeftside)), rightLeftside);

          const bothLeftside = `1${leftside}23`;
          assert.equal(decode(encodeURIComponent(bothLeftside)), bothLeftside);
        }
      });

      it('does not loose correctly encoded chars next to incorrectly encoded chars', () => {
        const encoded = encodeURIComponent(char);
        const correct = encodeURIComponent('™');
        for (let i = 1; i < encoded.length; i++) {
          const leftSingle = ` ${char}`;
          assert.equal(decode(encodeURIComponent(leftSingle)), leftSingle);

          const rightSingle = `${char} `;
          assert.equal(decode(encodeURIComponent(rightSingle)), rightSingle);

          const bothSingle = ` ${char} `;
          assert.equal(decode(encodeURIComponent(bothSingle)), bothSingle);


          const leftDouble = `¢${char}`;
          assert.equal(decode(encodeURIComponent(leftDouble)), leftDouble);

          const rightDouble = `${char}¢`;
          assert.equal(decode(encodeURIComponent(rightDouble)), rightDouble);

          const bothDouble = `¢${char}¢`;
          assert.equal(decode(encodeURIComponent(bothDouble)), bothDouble);


          const leftTriple = `™${char}`;
          assert.equal(decode(encodeURIComponent(leftTriple)), leftTriple);

          const rightTriple = `${char}™`;
          assert.equal(decode(encodeURIComponent(rightTriple)), rightTriple);

          const bothTriple = `™${char}™`;
          assert.equal(decode(encodeURIComponent(bothTriple)), bothTriple);


          const leftQuad = `💩${char}`;
          assert.equal(decode(encodeURIComponent(leftQuad)), leftQuad);

          const rightQuad = `${char}💩`;
          assert.equal(decode(encodeURIComponent(rightQuad)), rightQuad);

          const bothQuad = `💩${char}💩`;
          assert.equal(decode(encodeURIComponent(bothQuad)), bothQuad);
        }
      });
    });
  }

  describe('js module', () => {
    it('leaves non-encoded strings alone', () => {
      assert.equal(decode('test'), 'test');
    });

    describe('single chars', () => {
      validCodes(tests);
    });

    describe('surrogate chars', () => {
      validSurrogates(tests);
    });
  });
});
