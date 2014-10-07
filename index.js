var http = require('http')
  , Router = require('routes-router')
  , router = Router()
  , ot = require('./lib/over-time')
  , byCountry = require('./lib/by-country')

router.addRoute('/over-time', function (req, res) {
  ot().pipe(res)
})

// Total ebola cases
router.addRoute('/cases', function (req, res) {
  // TODO Real data
  res.end('3000')
})

// Cases in the last week (7 days)
router.addRoute('/cases/weekly', function (req, res) {
  // TODO Real data
  res.end('30')
})

router.addRoute('/cases/country', function (req, res) {
  byCountry('cases').pipe(res)
})

// Total deaths from ebola
router.addRoute('/deaths', function (req, res) {
  // TODO Real data
  res.end('2000')
})

// Deaths in the last week (7 days)
router.addRoute('/deaths/weekly', function (req, res) {
  // TODO Real data
  res.end('10')
})

router.addRoute('/deaths/country', function (req, res) {
  byCountry('deaths').pipe(res)
})

http.createServer(router).listen(process.env.PORT || 6078)
