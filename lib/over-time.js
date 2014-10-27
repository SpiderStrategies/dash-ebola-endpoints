var request = require('request')
  , endpoint = 'http://ebola.dat.thedash.com'
  , JSONStream = require('JSONStream')
  , es = require('event-stream')
  , util = require('util')
  , stream = require('stream')


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
          .pipe(es.map(function(data, next) {
              var retObj = {
                deaths: 0,
                cases: 0
              }
              Object.keys(data).forEach(function (d) {
                if (/Case/.test(d)) {
                  retObj.cases += data[d]
                } else if (/Deaths_/.test(d)) {
                  retObj.deaths += data[d]
                } else if (/Date/.test(d)) {
                  retObj.date = data[d]
                }
              })
              next(null, retObj)
            }))
          .pipe(new T)
}
