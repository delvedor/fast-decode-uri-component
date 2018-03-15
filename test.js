'use strict'

const { test } = require('tap')
const fastDecode = require('./index')

test('Basic', t => {
  const testCases = {
    'test': 'test',
    'a+b+c+d': 'a+b+c+d',
    '=a': '=a',
    '%25': '%',
    '%%25%%': '%%%%',
    'st%C3%A5le': 'ståle',
    'st%C3%A5le%': 'ståle%',
    '%st%C3%A5le%': '%ståle%',
    '%%7Bst%C3%A5le%7D%': '%{ståle}%',
    '%ab%C3%A5le%': '%abåle%',
    '%C3%A5%able%': 'å%able%',
    '%7B%ab%7C%de%7D': '{%ab|%de}',
    '%7B%ab%%7C%de%%7D': '{%ab%|%de%}',
    '%7 B%ab%%7C%de%%7 D': '%7 B%ab%|%de%%7 D',
    '%61+%4d%4D': 'a+MM',
    '\uFEFFtest': '\uFEFFtest',
    '\uFEFF': '\uFEFF',
    '%EF%BB%BFtest': '\uFEFFtest',
    '%EF%BB%BF': '\uFEFF',
    '†': '†',
    '%C2%B5': 'µ',
    '%C2%B5%': 'µ%',
    '%%C2%B5%': '%µ%',
    '%ab': null,
    '%ab%ab%ab': null,
    '%': null,
    '%E0%A4%A': null,
    '/test/hel%"Flo': null
  }

  Object.keys(testCases).forEach(testCase => {
    t.strictEqual(fastDecode(testCase), testCases[testCase])
    try {
      t.strictEqual(decodeURIComponent(testCase), testCases[testCase])
    } catch (e) {
      // we support also '%' if is alone, eg '%7B%ab%7C%de%7D'
      // here the url is composed as following:
      // %7B %ab %7C %de %7D
      // so '%ab' and '%de' will throw an error
      // with the native decodeURIComponent
    }
  })

  t.end()
})
