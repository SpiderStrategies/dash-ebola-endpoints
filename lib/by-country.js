var latest = require('./latest')
  , es = require('event-stream')
  , util = require('util')
  , stream = require('stream')

var T = function (type) {
  this.type = type
  stream.Transform.apply(this, arguments)
}

util.inherits(T, stream.Transform)

T.prototype._transform = function (chunk, encoding, next) {
  if (!this.called) {
    this.push('Country,' + this.type + '\n')
    this.called = true
  }
  this.push(chunk)
  next()
}

var unused = ['key', 'version', 'Total']

// type is "cases" or "deaths"
module.exports = function (type) {
  return latest().pipe(es.map(function (d, next) {
    var rows = Object.keys(d).map(String).filter(function (k) {
      return unused.indexOf(k) === -1
    }).map(function (country) {
      return country + ',' + d[country][type]
    }).join('\n')

    next(null, rows)
  }))
  .pipe(new T(type))
}
