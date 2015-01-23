# hackfile

Parser for the hackfile format

```
npm install hackfile
```

[![build status](http://img.shields.io/travis/mafintosh/hackfile.svg?style=flat)](http://travis-ci.org/mafintosh/hackfile)

## Format

The hackfile format is similar to a Makefile.  There are two accepted formats:

```
{name}
    {arg1}
    {arg2}
...
```

```
{name} {arg1}
    {arg2}
    {arg3}
...
```

## Usage

Assuming you have a hackfile that looks like this

```
foo bar

bar echo c
  echo d

bat
  echo e
  echo f
  echo g

baz echo a b c d
```

The following example

``` js
var hackfile = require('hackfile')
var fs = require('fs')

var parsed = hackfile(fs.readFileSync('hackfile', 'utf-8'))
console.log(parsed)
```

Prints out

```
[ [ 'foo', [ 'bar' ] ], 
  [ 'bar', [ [ 'echo', [ 'c' ] ], [ 'echo', [ 'd' ] ] ] ],
  [ 'bat', [ [ 'echo', [ 'e' ] ], [ 'echo', [ 'f' ] ], [ 'echo', [ 'g' ] ] ] ],
  [ 'baz', [ [ 'echo', [ 'a b c d' ] ] ] ] ]
```

## License

MIT
