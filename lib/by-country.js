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
    console.log(type)
    if (type !== 'deaths' && type !== 'cases') {  
      throw Error('Invalid type. Must be death or cases')     
    }
    var reg
    if (type == 'deaths') { 
      type = 'Death'
    } else {
      type = 'Case'
    }  
    reg = new RegExp(type) 
    var rows = Object.keys(d).map(String).filter(function (o) { 
      if (reg.test(o)) { 
        return o  
      }
    }).map(function (TypeCountry) { 
      var country = TypeCountry.substring(TypeCountry.indexOf('_') + 1) 
      return country + ',' + d[TypeCountry]
    }).join('\n')
    console.log(rows)
    next(null,rows)
  }))
  .pipe(new T(type))
}
