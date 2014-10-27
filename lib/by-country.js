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
  if (type !== 'deaths' && type !== 'cases') {
    throw Error('Invalid type. Must be death or cases')
  }
  var reg = new RegExp(type === 'deaths' ? 'Death' : 'Case')

  return latest().pipe(es.map(function (d, next) {
    var rows = Object.keys(d).map(String).filter(function (o) {
      return reg.test(o)
    }).map(function (typeCountry) {
      var country = typeCountry.substring(typeCountry.indexOf('_') + 1)
      country = country.split(/(?=[A-Z])/).join(' ')
      return country + ',' + d[typeCountry]
    }).join('\n')
    next(null,rows)
  }))
  .pipe(new T(type))
}
