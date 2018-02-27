const fs = require('fs');
const config    = require('./../config/config.json');
const path = require('path');
const AppResponse = require('./../models/AppResponse');

module.exports = class Utils {
  /* istanbul ignore next */
  static onErrorCallback (err) {
    if(err) throw err;
    console.log('Logged error in error log');
  }

  static logError (e) {
    var error = {
      error: e.message,
      time: new Date()
    }

    fs.appendFile(path.join(__dirname, '../../' + config.errorLog), "\n" + JSON.stringify(error), this.constructor.onErrorCallback);
  }
}
