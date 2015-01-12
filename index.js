var hackfile = function(src) {
  if (Buffer.isBuffer(src)) src = src.toString()
  
  var lines = src.replace(/\s+$/, '').split('\n')

  var indent = lines.reduce(function(indent, line) {
    return indent || (line.match(/(\s+)\S/) || [])[1]
  }, null)

  var latest = null
  var result = []

  lines.forEach(function(line) {
    if (!line.trim()) return
    
    var indented = line.indexOf(indent) === 0

    if (/^\s/.test(line) && !indented) throw new SyntaxError('Inconsistent indentation')
    if (!latest && indented) throw new SyntaxError('Unnamed indentation group not allowed')

    if (indented) return result[result.length - 1][1].push(line.trim())

    var latestLine = line.trim().split(/\s+/)
    latest = latestLine.splice(0, 1)[0]

    result.push([latest, []])
    if (latestLine.length > 0) result[result.length - 1][1].push(latestLine.join(" "))
  })

  return result
}

module.exports = hackfile
