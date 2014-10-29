var latest = require('./latest')
  , es = require('event-stream')
  , total = require('./get-totals')

module.exports = function (type) {
  if (type !== 'deaths' && type !== 'cases') {
    throw Error('Invalid type. Must be death or cases')
  }

  return latest().pipe(es.map(total))
                 .pipe(es.map(function (d, next) {
                   next(null, d[type].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
                 }))
}
