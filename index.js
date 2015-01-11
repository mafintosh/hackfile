var hackfile = function(src) {
  if (Buffer.isBuffer(src)) src = src.toString()
  
  var lines = src.replace(/\s+$/, '').split('\n')

  var indent = lines.reduce(function(indent, line) {
    return indent || (line.match(/(\s+)\S/) || [])[1]
  }, null)

  var latest = null
  var result = {}

  lines.forEach(function(line) {
    if (!line.trim()) return
    
    var indented = line.indexOf(indent) === 0

    if (/^\s/.test(line) && !indented) throw new SyntaxError('Inconsistent indentation')
    if (!latest && indented) throw new SyntaxError('Unnamed indentation group not allowed')

    if (indented) return result[latest].push(line.trim())

    latest_line = line.trim().split(/\s+/)
    latest = latest_line.splice(0, 1)

    result[latest] = []
    if (latest_line.length > 0) result[latest].push(latest_line.join(" "))
  })

  return result
}

module.exports = hackfile
