const config = require("../config.js")
function log(msg, prefix = '') {
  if (config.consoleflag) {
    console.log(prefix, msg)
  }
}

module.exports = {
  log: log
}
