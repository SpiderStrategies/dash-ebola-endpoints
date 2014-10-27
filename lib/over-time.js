var request = require('request')
  , endpoint = 'http://ebola.dat.thedash.com'
  , JSONStream = require('JSONStream')
  , es = require('event-stream')
  , util = require('util')
  , stream = require('stream')
  , total = require('./get-totals')

var T = function () {
  stream.Transform.call(this, { objectMode: true })
}

util.inherits(T, stream.Transform)

T.prototype._transform = function (chunk, encoding, next) {
  if (!this.called) {
    this.push('Date,Cases,Deaths\n')
    this.called = true
  }
  this.push(chunk.date + ',' + chunk.cases + ',' + chunk.deaths + '\n')
  next()
}

module.exports = function () {
  return request(endpoint + '/api/rows?limit=0') // fetch all
          .pipe(JSONStream.parse(['rows', true])) // parse each row
          .pipe(es.map(total))
          .pipe(new T)
}
