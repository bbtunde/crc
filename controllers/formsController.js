/* istanbul ignore next */
const config = require('./../config/config.json');
const FormService = require('./../services/formService');
const ControllerUtils = require('./../services/controllerUtils');
const AppResponse = require('./../models/AppResponse');
const ResponseCode = require('./../models/ResponseCode');

/**
* @api {post} /api/v1/formtype/:service-key Get Form Type
* @apiVersion 1.0.0
* @apiName FormType
* @apiGroup Forms
* @ApiDescription Will have different "Responses" depending on the "Request" sent for the form type.
* @apiUse EmptyRequest100
* @apiUse FormTypeSuccessResponseEmptyRequest100
* @apiUse Request100
* @apiUse FormTypeSuccessResponseFilledRequest100
* @apiUse FormTypeErrorResponse100
*/
function getFormType(request, response, next) {
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

    FormService.getForm(request.params['service-key'], request.body)
      .then((formElements) => {
        return next(response.json(200, new AppResponse(ResponseCode.SUCCESS, formElements, [])));
      })
      .catch((AppError) => {
        ControllerUtils.sendErrorResponse(AppError, response, next);
      });
  } catch (e) {
    ControllerUtils.sendErrorResponse(e, response, next);
  }
}
exports.getFormType = getFormType;
