var tape = require('tape')
var hackfile = require('../')
var fs = require('fs')

var read = function(name) {
  return fs.readFileSync(__dirname+'/fixtures/'+name, 'utf-8')
}

tape('parses', function(t) {
  var result = [['foo', ['bar']], ['bar', ['echo c', 'echo d']], ['bat', ['echo e', 'echo f', 'echo g']], ['baz', ['echo a b c d']]]
  t.same(hackfile(read('working')), result, 'parses working file')
  t.end()
})

tape('basic nesting', function(t) {
  var result = [['pipeline', [['foo', ['bar']]]]]
  t.same(hackfile(read('nesting')), result, 'parses nested file')
  t.end()
})

tape('nesting', function(t) {
  var result = [['foo', ['bar']], ['bar', ['echo c', 'echo d']], ['bat', [['pipe', ['echo e', 'echo f']], 'echo g']], ['baz', ['echo a b c d']]]
  t.same(hackfile(read('nesting-basic')), result, 'parses working nested file')
  t.end()
})

tape('indent dedent', function(t) {
  var result = [['pipeline', ['foo', ['pipe', ['echo hello', 'transform', 'cat']], ['run', ['echo', 'hello']]]]]
  t.same(hackfile(read('indent-dedent')), result, 'parses working nested file with varied indents and dedents')
  t.end()
})

tape('advanced', function(t) {
  var result = [["pipeline",["foo", "run echo hi",["map",["curl http","a","b","c",["pipe",["echo hello","transform","cat"]]]],["run",["echo","hi"]]]],["pipeline",["bar","run echo hi"]],["run",["echo bye"]]]
  t.same(hackfile(read('nesting-advanced')), result, 'parses advanced nested file with varied format, indents, dedents, multiple pipelines')
  t.end()
})

tape('indent size four', function(t) {
  var result = [["foo", ["bar", ["baz", ["bat"]]]]]
  t.same(hackfile(read('indent-four')), result, 'parses a simple file with indent size four')
  t.end()
})

tape('single line commands only', function(t) {
  var result = [["run", ["echo a"]], ["run", ["echo b"]], ["run", ["echo c"]], ["run", ["echo d"]], ["run", ["echo e"]]]
  t.same(hackfile(read('single-lines')), result, 'parses a hackfile with only single-line commands')
  t.end()
})

tape('handle quotes properly', function(t) {
  var result = [[ '\'pipeline\'', [ 'hello', 'run \'echo hi\'' ]]]
  t.same(hackfile(read('quotes')), result, 'parses a hackfile with quotes')
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

tape('bails on inconsistent indentation', function(t) {
  try {
    hackfile(read('indent-bad'))
    t.ok(false, 'should not parse file')
  } catch (err) {
    t.ok(err instanceof SyntaxError, 'should fail with a SyntaxError')
    t.end()
  }
})
