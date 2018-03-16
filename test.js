'use strict'

const { test } = require('tap')
const fastDecode = require('./index')

test('Basic', t => {
  const uri = [
    'test', 'a+b+c+d', '=a', '%25', '%%25%%', 'st%C3%A5le', 'st%C3%A5le%', '%st%C3%A5le%', '%%7Bst%C3%A5le%7D%',
    '%ab%C3%A5le%', '%C3%A5%able%', '%7B%ab%7C%de%7D', '%7B%ab%%7C%de%%7D', '%7 B%ab%%7C%de%%7 D', '%61+%4d%4D',
    '\uFEFFtest', '\uFEFF', '%EF%BB%BFtest', '%EF%BB%BF', '†', '%C2%B5', '%C2%B5%', '%%C2%B5%', '%ab', '%ab%ab%ab',
    '%', '%E0%A4%A', '/test/hel%"Flo', '/test/hel%2Flo'
  ]

  uri.forEach(testCase => {
    try {
      t.strictEqual(decodeURIComponent(testCase), fastDecode(testCase))
    } catch (e) {
      t.strictEqual(fastDecode(testCase), null)
    }
  })

  t.end()
})
