const AppResponse = require('./../models/AppResponse');
const ResponseCode = require('./../models/ResponseCode');

var getHealth = function (request, response, next) {
  return next(response.json(200, new AppResponse(ResponseCode.SUCCESS, "Hola...CRC engine running", [])));
}
module.exports.getHealth = getHealth;
