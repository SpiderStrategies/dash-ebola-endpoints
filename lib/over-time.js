var request = require('request')
  , endpoint = 'http://ebola.dat.thedash.com'
  , JSONStream = require('JSONStream')
  , es = require('event-stream')
  , util = require('util')
  , stream = require('stream')

var T = function () {
  stream.Transform.apply(this, arguments)
}

util.inherits(T, stream.Transform)

T.prototype._transform = function (chunk, encoding, next) {
  if (!this.called) {
    this.push('Date,Cases,Deaths\n')
    this.called = true
  }
  this.push(chunk)
  next()
}

module.exports = function () {
  return request(endpoint + '/api/rows?limit=0') // fetch all
           .pipe(JSONStream.parse(['rows', true])) // parse each row
           .pipe(es.map(function (d, next) { // map them into some csv format
             next(null, d.key + ',' + d.Total.cases + ',' + d.Total.deaths + '\n')
           }))
           .pipe(new T)
}
