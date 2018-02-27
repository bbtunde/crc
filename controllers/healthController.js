const AppResponse = require('./../models/AppResponse');
const ResponseCode = require('./../models/ResponseCode');

/**
* @api {get} /api/v1/ Health Check
* @apiVersion 1.0.0
* @apiName FormType
* @apiGroup Health Check
* @apiUse HealthCheckSuccessResponse100
*/
var getHealth = function (request, response, next) {
  return next(response.json(200, new AppResponse(ResponseCode.SUCCESS, "You know for PAGA adapter", [])));
}
module.exports.getHealth = getHealth;
