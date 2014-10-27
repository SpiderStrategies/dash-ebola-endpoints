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
          .pipe(es.map(function(data, next) {
              var retObj = {}
              retObj.TotalDeaths = 0 
              retObj.TotalCases = 0 
              Object.keys(data).forEach(function (d) { 
                if (/Case/.test(d)) { 
                  retObj.TotalCases += data[d]  
                } else if (/Deaths_/.test(d)) { 
                  retObj.TotalDeaths += data[d]  
                } else if (/Date/.test(d)) { 
                  retObj.date = data[d] 
                } 
              })
              console.log(retObj)
              next(null, retObj) 
            }))
          .pipe(new T({objectMode:true}))
}
