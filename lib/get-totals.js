module.exports = function (data, next) {
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
}
