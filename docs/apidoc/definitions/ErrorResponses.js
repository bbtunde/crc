/**
 * @apiDefine FormTypeErrorResponse100
 * @apiSuccessExample Error-Response Invalid Service
 * HTTP/1.1 400 Bad Request
 {
    "code": "INVALID_SERVICE_KEY",
    "errors": [],
    "response": "Request URL must contain a valid service key"
 }
 */

/**
 * @apiDefine FailedDeliveryErrorResponse100
 * @apiSuccessExample Error-Response Failed Delivery
 * HTTP/1.1 400 Bad Request
 {
    "code": "FAILED_DELIVERY",
    "errors": [],
    "response": "Service Error Occured"
 }
 */

 /**
 * @apiDefine GenericErrorResponse100
 * @apiSuccessExample Error-Response Server Error
 * HTTP/1.1 500 Server Error
 {
    "code": "SERVER_ERROR",
    "errors": [],
    "response": "Internal server error"
 }
 */

/**
 * @apiDefine InvalidRequestErrorResponse100
 * @apiSuccessExample Error-Response Invalid Request
 * HTTP/1.1 500 Server Error
 {
    "code": "INVALID_REQUEST",
    "response": "Invalid request message",
    "errors": [ ]
}
 */
