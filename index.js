var debug = require('debug')('hackfile')

var hackfile = function(src) {
  if (Buffer.isBuffer(src)) src = src.toString()

  var lines = src.replace(/\s+$/, '').split('\n')

  var indent = lines.reduce(function(indent, line) {
    return indent || (line.match(/(\s+)\S/) || [])[1]
  }, null)

  var latest = null
  var commands = []
  var indents = []
  var appendTo = []
  var indentSize = 0

  lines.forEach(function(line) {
    if (!line.trim()) return

    var indented = line.indexOf(indent) === 0

    if (!latest && indented) throw new SyntaxError('Unnamed indentation group not allowed')

    //Nested command
    if (indented) {
      var currIndent = line.match(/(\s+)\S/)[1].length
      var lastIndent = indents[indents.length - 1]

      //Set indentSize based on first indent found
      if (lastIndent === 0) indentSize = currIndent

      //INDENT
      if (currIndent > lastIndent) {
        var prev = appendTo.pop()
        var prevLine = prev.split(/\s+/)
        var prevName = prevLine.shift()
        appendTo.push(prevName)
        appendToken(appendTo, "INDENT", currIndent - lastIndent, indentSize)
        if (prevLine.length > 0 ) appendTo.push(prevLine.join(" "))
      }

      //DEDENT
      if (currIndent < lastIndent) appendToken(appendTo, "DEDENT", lastIndent - currIndent, indentSize)
      if (currIndent != lastIndent) indents.push(currIndent)
      appendTo.push(line.trim())

    } else { //New command (not indented)
    
      //Handle last level(s) of DEDENT of previous command
      if (indents.length > 0) appendToken(appendTo, "DEDENT", indents[indents.length - 1], indentSize)

      latest = line.trim().split(/\s+/)[0]
      appendTo = [line.trim()]
      commands.push(appendTo)
      indents.push(0)
    }
  })

  //Handle last level(s) of DEDENT
  if (indents.length > 0) {
    var numIndents = indents[indents.length - 1]
    appendToken(appendTo, "DEDENT", numIndents, indentSize)
  }

  //Nest each line of each command
  var newCommands = []
  commands.forEach(function(command) {
    var newCommand = []
    //Handle single line commands
    if (command.length == 1) {
      var line =  command[0].split(/\s+/)
      var name = line.shift()
      newCommand.push(name, "INDENT")
      if (line.length == 1) {
        newCommand.push(line[0])
      } else { //Nest line of single line command
        newCommand.push(line.shift(), "INDENT", line.join(" "), "DEDENT")
      }
      newCommand.push("DEDENT")
    } else {
      command.forEach(function(line) {
        var args = line.split(/\s+/)
        if (args.length > 1) {
          var name = args.shift()
          newCommand.push(name, "INDENT", args.join(" "), "DEDENT")
        } else {
          newCommand.push(args[0])
        }
      })
    }
    newCommands.push(newCommand)
  })

  debug("tokens", newCommands)
  return newCommands.map(function(cmd) {
    return map(cmd)[0]
  })
}

/* Push TOKEN to ARRAY NUMINDENTS/INDENTSIZE times, handles bad indentation */
var appendToken = function(array, token, numIndents, indentSize) {
  debug("numIndents in appendToken", numIndents)
  debug("indentSize in appendToken", indentSize)
  if (numIndents === indentSize && indentSize === 0) return
  if (numIndents % indentSize != 0) throw new SyntaxError('Inconsistent indentation')
  numTimes = numIndents/indentSize
  for (var i = 0; i < numTimes; i += 1) array.push(token)
}

/*  Maps over COMMANDS and returns JSON according to hackfile spec */
var map = function(commands) {
  var result = []

  while (commands.length) {
    var token = commands.shift()
    if (token === 'INDENT') {
      result.push([result.pop(), map(commands)])
      continue
    }
    if (token === 'DEDENT') {
      return result
    }
    result.push(token)
  }
  return result
}

module.exports = hackfile
