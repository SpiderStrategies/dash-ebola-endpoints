var request = require('request')
  , endpoint = 'http://ebola.dat.thedash.com'
  , JSONStream = require('JSONStream')
  , reduce = require('stream-reduce')

module.exports = function () {
  return request(endpoint + '/api/rows?limit=0') // fetch all
           .pipe(JSONStream.parse(['rows', true])) // parse each row
           .pipe(reduce(function (acc, data) {
              return data
           }, {}))
}
