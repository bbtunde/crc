/**
 * @apiDefine GetUserErrorResponse
 * @apiSuccessExample Error-Response Invalid Request
 * HTTP/1.1 400 Bad Request
 {
    "code": "INVALID_REQUEST",
    "response": "dob is required for search_type normal ",
    "errors": [
        {
            "dob": "Date of birth is required"
        }
    ]
}
 */


 /**
 * @apiDefine GetUserError
 * @apiSuccessExample Error-Response Invalid search_type
 * HTTP/1.1 400 Bad Request
 {
    "code": "INVALID_REQUEST",
    "response": " Invalid Search type can only be ['bvn','phone_number','account','normal'] ",
    "errors": [
        {
            "search_type": "Invalid search type"
        }
    ]
}
 */

  /**
 * @apiDefine GetUserError1
 * @apiSuccessExample Error-Response User not found
 * HTTP/1.1 500 Bad Request
 {
    "code": "UNKNOWN_ERROR",
    "response": "Error retrieving user details",
    "errors": {
        "ERROR-LIST": [
            {
                "ERROR-CODE": [
                    "57"
                ]
            }
        ]
    }
}
 */



 