# fast-decode-uri-component

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

Decodes strings encoded by `encodeURI` and `encodeURIComponent`, without throwing errors on invalid escapes, instead, it returns `null`.


## Installation
```
npm install fast-decode-uri-component
```

## Usage
```js
const fastDecode = require('fast-decode-uri-component')

console.log(fastDecode('test')) // 'test'
console.log(fastDecode('%7B%ab%7C%de%7D')) // '{%ab|%de}'
console.log(fastDecode('%ab')) // null
```

We support also '%' if is alone, eg `'%7B%ab%7C%de%7D'` here the url is composed as following: `%7B %ab %7C %de %7D` so `'%ab'` and `'%de'` will throw an error with the native `decodeURIComponent`.

## Benchmarks
You can find the benchmark file [here](https://github.com/delvedor/fast-decode-uri-component/blob/master/bench.js).
```
# fast-decode-uri-component
ok ~539 ms (0 s + 539114308 ns)

# decodeURIComponent
ok ~6.06 s (6 s + 62305153 ns)
```

## Acknowledgements
This project has been forked from [`jridgewell/safe-decode-uri-component`](https://github.com/jridgewell/safe-decode-uri-component) because I wanted to change the behaviour of the library on invalid inputs, plus change some internals.<br>
All the credits before the commit [`53000fe`](https://github.com/delvedor/fast-decode-uri-component/commit/53000feb8c268eec7a24620fd440fdd540be32b7) goes to the `jridgewell/safe-decode-uri-component` project [contributors](https://github.com/delvedor/fast-decode-uri-component/graphs/contributors).<br>
Since the commit [`aaa`](aaa) the project will be maintained by the @delvedor.

## License

Licensed under [MIT](./LICENSE).
