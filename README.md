# hackfile

Parse for the hackfile format

```
npm install hackfile
```

## Format

The hackfile format is similar to a Makefile

```
{name}
(indent){arg1} {arg2}...
```

## Usage

Assuming you have a hackfile that looks like this

```
foo
  bar
  baz

bar
  bar baz
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
{
  foo: [['bar'], ['baz']],
  bar: [['bar', 'baz']]
}
```

## License

MIT
