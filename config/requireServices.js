var services = {};

var ServiceSchemaValidation = require('../services/serviceSchemaValidation');
var normalizedPath = require("path").join(__dirname, "services");
var _self = this;
var sValidation;

/* istanbul ignore next */
require("fs").readdirSync(normalizedPath).forEach(function(file) {
    let valid = true;
    let service = require("./services/" + file);
    for (let serviceKey in service) {
        sValidation = new ServiceSchemaValidation(service[serviceKey]);
        let result = sValidation.validate();
        if (result.error !== null) {
            valid = false;
            break;
        }
    }
    if (valid) {
        services = extend(services, service);
    }
    
});

/**
 * Merge between multiple JSON Objects
 * @param {*Object} target 
 */
/* istanbul ignore next */
function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

module.exports.services = services;