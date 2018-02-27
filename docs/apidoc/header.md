
Etranzact is an adapter to Etranzact distributor built for in a Node.js framework [Restify](http://restify.com/).

---

## Base Protocol

Etranzact API is built on top of the Representational State Transfer (REST) architecture design style. It's designed to be used by Dozer in order to access Etranzact distributor forms API.

#### Methods

The API will answer to the following methods:

- GET
- POST

#### Client Authentication

The API server does not keep state information, like sessions.
The API authentication:

- Etranzact client authentication:

Clients will need to authenticate in order to access resources.

The authentication is set through headers "username" and "password".
A valid username and password must be sent in request.

Lack or invalid access will result in a 401 response code.

####  Success response format

Any success response will be returned as

```json
{
    "code": "SUCCESS",
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
```
Every response representations are returned as object. The response code with success will be 200 HTTP OK

####  Error response format

Any invalid response or not success response will be returned as

```json
{
    "code": "INVALID_SERVICE_KEY",
    "errors": [],
    "response": "Request URL must contain a valid service key"
}
```

####  Error response codes

| Error Code                    | Status Code | Message |
| ------------------------      |:-----------:| ------- |
|UNKNOWN_ERROR                  |500|Unexpected error occurred|
|NOT_FOUND                      |404|Requested resource not available or non-existent|
|INVALID_PURCHASE_HANDLER       |400|Adapter's request handler missing in source code|
|INVALID_AUTHENTICATION         |401|Submitted credentials are wrong or missing|
|INVALID_SERVICE_KEY            |400|Requested service key doesn't exist in adapter|
|INVALID_BODY                   |400|Submitted request has an invalid body format or content|
|DISTRIBUTOR_UNAVAILABLE        |500|The distributor endpoint is not responding|
|SERVICE_TEMPORARILY_UNAVAILABLE|500|Jumia One Core keeps trying to use the resource while receiving this code.|
|INVALID_REQUEST                |400|The submitted request has invalid information|
|SUCCESS                        |200|Transaction/Request success|

Any invalid response or not success response will be returned as

```
{
    "code": "INVALID_SERVICE",
    "errors": [],
    "response": "Request URL must contain a valid service key"
}
```

---

## Postman

For development and testing purposes, a Postman Collection is available in the postman folder in the /docs/postman folder of the repository.
Also a local environment is provided for developers.

#### Postman configuration

1. Import the main collection
2. Import the local environment (or other, like development or release)
3. Select the environment in Postman
4. See [collections](https://www.getpostman.com/docs/collections) and [environments](https://www.getpostman.com/docs/environments) for details on how to do this.

---

## Etranzact API Resources

Etranzact API provides 3 resources that are described in the following sections.

The Endpoint used to connect to the stagging enviroment: http://83.138.190.170


### Credit phone number - POST /VTUAPI/v3/getCredit
This resource is used to credit the submitted mobile phone number with an amount within a range.

#### Request

|Field|Type|Notes
|:-----------|:------------|:------------|
|username|string|User name given by ETRANZACT to a registered user
|password|string|Password given by ETRANZACT to a registered user
|msisdn|string|The mobile number to be credited
|network|string|Name of the network operator such as MTN, GLO, ETISALAT or AIRTEL
|amount|string|Amount to be credited to the given msisdn


```json
{
    "username":"bello",
    "password":"password",
    "amount":"100",
    "msisdn":"2354646487987",
    "network":"MTN"
}
```

#### Error Response


|Field|Type|Notes
|:-----------|:------------|:------------|
|status|string|success/failure
|reason|string|reason for failure
|errorCode|string|code that indicates the reason
|balance|string|The remaining balance on the user account


```json
{
	"errorCode":"0",
	"statusCode":"Failed",
	"reason":"Not a valid user!"
}
```


#### Success Response

|Field|Type|Notes
|:-----------|:------------|:------------|
|status|string|success/failure
|balance|numeric|operator


```json
{
	"status":"Success",
	"balance":1000
}
```

### Credit phone number by data plan - POST /ETRANZACTData/getData

This resource is used credit the submitted mobile phone number based in an existing plan provided by the operator.

#### Request

|Field|Type|Notes
|:-----------|:------------|:------------|
|username|string|User name given by ETRANZACT to a registered user
|password|string|Password given by ETRANZACT to a registered user
|msisdn|string|The mobile number to be credited
|network|string|Name of the network operator such as DSTV,GOtv,Startimes, Swift ...
|dataplan|string|The data plan to purchase. It must exist on the network


```json
{
	"username":"bello",
	"password":"password",
	"msisdn":"08034067144",
	"network":"GLO",
    "dataplan":"DATA-21-3G"
}
```


#### Response

The same response structure in "Credit phone number" subsection


### Gel all available plans (all providers) - GET ETRANZACTData/data_plan_details

This resource includes a complete list of data plans for all providers. No filter or sorting features available.

#### Request
No parameters or body required.

#### Response

```json
[
    {
        "OPERATOR": "GLO",
        "AMOUNT": "100",
        "DATA_PLAN": "DATA-21",
        "DATAPLAN_DESC": "N100= 35MB 1 Day"
    },
    {
        "OPERATOR": "MTN",
        "AMOUNT": "5000",
        "DATA_PLAN": "DATA-6-MTN",
        "DATAPLAN_DESC": "10GB for N5000 "
    },
    {
        "OPERATOR": "9MOBILE",
        "AMOUNT": "110000",
        "DATA_PLAN": "DATA-12-9MOBILE",
        "DATAPLAN_DESC": "N110000= 120GB 365 Days"
    },
    {
        "OPERATOR": "AIRTEL",
        "AMOUNT": "100",
        "DATA_PLAN": "DATA-1_AIRTEL",
        "DATAPLAN_DESC": "This Daily bundle gives 30MB for N100 valid for 1 day"
    },
]
```

---
