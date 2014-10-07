var http = require('http')
  , Router = require('routes-router')
  , router = Router()
  , ot = require('./lib/over-time')
  , byCountry = require('./lib/by-country')
  , totals = require('./lib/totals')

router.addRoute('/over-time', function (req, res) {
  ot().pipe(res)
})

// Total ebola cases
router.addRoute('/cases/total', function (req, res) {
  totals('cases').pipe(res)
})

// Cases in the last week (7 days)
router.addRoute('/cases/total/weekly', function (req, res) {
  // TODO Real data
  res.end('30')
})

router.addRoute('/cases/country', function (req, res) {
  byCountry('cases').pipe(res)
})

// Total deaths from ebola
router.addRoute('/deaths/total', function (req, res) {
  totals('deaths').pipe(res)
})

// Deaths in the last week (7 days)
router.addRoute('/deaths/total/weekly', function (req, res) {
  // TODO Real data
  res.end('10')
})

router.addRoute('/deaths/country', function (req, res) {
  byCountry('deaths').pipe(res)
})

http.createServer(router).listen(process.env.PORT || 6078)
