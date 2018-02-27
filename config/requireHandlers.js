
var normalizedPath = require("path").join(__dirname, "../handlers");

let handlers = {};

require("fs").readdirSync(normalizedPath).forEach(function(file) {
    handlers = extend(require("../handlers/" + file));
});

/**
 * Merge between multiple JSON Objects
 * @param {Object} target 
 */
function extend(target) {
    return Object.assign(handlers, target) ;
}

module.exports.handlers = handlers;