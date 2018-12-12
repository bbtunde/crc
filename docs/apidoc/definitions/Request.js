/**
 * @apiDefine GetUserWithBVN
 * @apiSuccessExample Get User Using BVN
 * HTTP/1.1 200 OK
 {"search_type":"bvn",
   "bvn":"22255291428"}
 */

 /**
 * @apiDefine GetUserWithPhone
 * @apiSuccessExample Get User Using Phone Number
 * HTTP/1.1 200 OK
 {"search_type":"phone_number",
 "telephone":"08072090611"}
 */

  /**
 * @apiDefine GetUserWithAccount
 * @apiSuccessExample Get User Using Account
 * HTTP/1.1 200 OK
 {"search_type":"account","account_number":"105C030006777","name":"YEKINI OJO ISKILU","branch_code":"000"}
 */

  /**
 * @apiDefine GetUserWithName
 * @apiSuccessExample Get User Using Name and DOB
 * HTTP/1.1 200 OK
 {"search_type":"normal","dob":"13-APR-1983","name":"YEKINI OJO ISKILU","gender":"001"}
 */




