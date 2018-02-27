/**
 * @apiDefine FormTypeSuccessResponseEmptyRequest100
 * @apiSuccessExample {json} Success-Response with empty Request
 * HTTP/1.1 200 OK
 {
    "code": "SUCCESS",
    "errors": [],
    "response": {
        "service_key": "airtime.local.airtime.vodafone",
        "elements": [
            {
                "key": "phone_number",
                "template": "phone_with_country",
                "label": "What is your phone number?",
                "validator": [
                    {
                        "type": "required",
                        "options": [],
                        "messages": "This field is required"
                    }
                ],
                "options": [
                    {
                        "label": "Egypt",
                        "icon": "http://www.oorsprong.org/WebSamples.CountryInfo/Images/Egypt.jpg",
                        "option_value": "EG_+20",
                        "message": "",
                        "preselected": false,
                        "form_elements": []
                    }
                ]
            }
        ],
        "step": 1,
        "step_count": 1
    }
}
 */

/**
 * @apiDefine FormTypeSuccessResponseFilledRequest100
 * @apiSuccessExample {json} Success-Response with filled Request
 * HTTP/1.1 200 OK
 {
     "code": "SUCCESS",
     "response": {
         "serviceKey": "electricity.postpaid.eko",
         "elements": []
     }
 }
 */

/**
 * @apiDefine HealthCheckSuccessResponse100
 * @apiSuccessExample {json} Health check response
 * HTTP/1.1 200 OK
{
    "code": "SUCCESS",
    "response": "You know for Etranzact adapter"
}
 */ 

/**
 * @apiDefine MakePurchaseSuccessResponse100
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 {
     "code": "SUCCESS",
     "response": {
         "transaction_reference": "09FG01171550020065615",
         "distributor_response": {
             "direction": "response",
             "reference": "09FG01171550020065615",
             "amount": "0.0",
             "totalFailed": "0",
             "totalSuccess": "0",
             "error": "0",
             "message": "Status: GOTV[4601493375] Successful; Other Details: 1~14921768~SUCCESSFUL; Reference: 09FG01171550020065615",
             "otherReference": "jone1516200631934",
             "action": "PB",
             "openingBalance": "0.0",
             "closingBalance": "0.0"
         },
         "extra_info": “A custom message regarding METER TOKEN”
     }
 }

 */

/**
 * @apiDefine OrderSummarySuccessResponse100
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 {
     "code": "SUCCESS",
     "response": {
         "destination": "phone_number",
         "payment_details": [
             {
                 "type": "total_price",
                 "value": 100,
                 "options": [
                     {
                         "currency": "NGN"
                     }
                 ]
             }
         ]
     }
 }
 */


