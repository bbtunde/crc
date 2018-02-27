/* istanbul ignore next */
const config = require('./../config/config.json');
const OrderService = require('./../services/orderService');
const ControllerUtils = require('./../services/controllerUtils');
const AppResponse = require('./../models/AppResponse');
const ResponseCode = require('./../models/ResponseCode');

/**
* @api {post} /api/v1/ordersummary/:service-key  Order Summary
* @apiVersion 1.0.0
* @apiName OrderSummary
* @apiGroup Order
* @ApiDescription Shows the order summary before going to make purchase
* @apiUse Request100
* @apiUse OrderSummarySuccessResponse100
* @apiUse InvalidRequestErrorResponse100
* @apiUse FormTypeErrorResponse100
*/
function orderSummary(request, response, next) {
  try {
    // authenticate request
    if (!ControllerUtils.isRequestWithValidCredentials(request)) {
      return next(response.json(401, new AppResponse(ResponseCode.INVALID_AUTHENTICATION, "Header must contain valid username and password", [])));
    }

    // validate service key
    if (!ControllerUtils.isRequestWithValidServiceKey(request)) {
      return next(response.json(400, new AppResponse(ResponseCode.INVALID_SERVICE_KEY, "Request URL must contain a valid service key", [])));
    }

    // validate not empty body
    if (!ControllerUtils.isRequestWithValidBody(request)) {
      return next(response.json(400, new AppResponse(ResponseCode.INVALID_BODY, "Request must contain a valid body", [])));
    }

    OrderService.getOrderSummary(request.params['service-key'], request.body)
      .then((paymentDetails) => {
        return next(response.json(200, new AppResponse(ResponseCode.SUCCESS, paymentDetails, [])));
      })
      .catch((err) => {
        return ControllerUtils.sendErrorResponse(err, response, next);
      });
  } catch (e) {
    return ControllerUtils.sendErrorResponse(e, response, next);
  }
}
exports.orderSummary = orderSummary;

/**
* @api {post} /api/v1/makepurchase/:service-key Make Purchase
* @apiVersion 1.0.0
* @apiName MakePurchase
* @apiGroup Order
* @ApiDescription Shows the make purchase
* @apiUse Request100
* @apiUse MakePurchaseSuccessResponse100
* @apiUse FormTypeErrorResponse100
* @apiUse FailedDeliveryErrorResponse100
*/
function makePurchase(request, response, next) {
  try {
    // authenticate request
    if (!ControllerUtils.isRequestWithValidCredentials(request)) {
      return next(response.json(401, new AppResponse(ResponseCode.INVALID_AUTHENTICATION, "Header must contain valid username and password", [])));
    }

    // validate service key
    if (!ControllerUtils.isRequestWithValidServiceKey(request)) {
      return next(response.json(400, new AppResponse(ResponseCode.INVALID_SERVICE_KEY, "Request URL must contain a valid service key", [])));
    }

    // validate not empty body
    if (!ControllerUtils.isRequestWithValidBody(request)) {
      return next(response.json(400, new AppResponse(ResponseCode.INVALID_BODY, "Request must contain a valid body", [])));
    }

    OrderService.makePurchase(request.params['service-key'], request.body)
      .then((purchaseResponse) => {
        return next(response.json(200, new AppResponse(ResponseCode.SUCCESS, purchaseResponse, [])));
      })
      .catch((appError) => {
        return ControllerUtils.sendErrorResponse(appError, response, next);
      });
  } catch (e) {
    return ControllerUtils.sendErrorResponse(e, response, next);
  }
}
exports.makePurchase = makePurchase;
