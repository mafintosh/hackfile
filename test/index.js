var tape = require('tape')
var hackfile = require('../')
var fs = require('fs')

var read = function(name) {
  return fs.readFileSync(__dirname+'/fixtures/'+name, 'utf-8')
}

tape('parses', function(t) {
  var result = { foo: ['echo a', 'echo b'], bar: ['echo c', 'echo d'], bat: ['echo e', 'echo f', 'echo g'], baz: ['echo a b c d'] }

  t.same(hackfile(read('working')), result, 'parses working file')
  t.end()
})

tape('bails on invalid file', function(t) {
  try {
    hackfile(read('not-working'))
    t.ok(false, 'should not parse file')
  } catch (err) {
    t.ok(err instanceof SyntaxError, 'should fail with a SyntaxError')
    t.end()
  }
})
