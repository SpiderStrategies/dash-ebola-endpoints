var latest = require('./latest')
  , es = require('event-stream')

module.exports = function (type) {
  return latest().pipe(es.map(function (d, next) {
    next(null, String(d.Total[type]))
  }))
}

