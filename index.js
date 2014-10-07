var http = require('http')
  , Router = require('routes-router')
  , router = Router()
  , ot = require('./lib/over-time')

router.addRoute('/over-time', function (req, res) {
  ot().pipe(res)
})

http.createServer(router).listen(process.env.PORT || 6078)
