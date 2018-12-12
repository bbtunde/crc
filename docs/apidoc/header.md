
CRC API is built on  [Node js] framework

---

## Base Protocol

WWW API is built on top of the Representational State Transfer (REST) architecture design style. It's designed to be used by the two native Mobile app and the admin dashboard React app.

#### Methods

The API will answer to the following methods:

- GET
- POST

#### Client Authentication

The API server does not keep state information, like sessions.
The API authentication:

- API client authentication:

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
       
    }
}
```
Every response representations are returned as object. The response code with success will be 200 HTTP OK

####  Error response format

Any invalid response or not success response will be returned as

```json
{
    "code": "INVALID_REQUEST",
    "errors": [],
    "response": "Invalid username and password"
}
```

####  Error response codes

| Error Code                    | Status Code | Message |
| ------------------------      |:-----------:| ------- |
|UNKNOWN_ERROR                  |500|Unexpected error occurred|
|NOT_FOUND                      |404|Requested resource not available or non-existent|
|INVALID_AUTHENTICATION         |401|Submitted credentials are wrong or missing|
|INVALID_BODY                   |400|Submitted request has an invalid body format or content|
|INVALID_REQUEST                |400|The submitted request has invalid information|
|SUCCESS                        |200|Transaction/Request success|

Any invalid response or not success response will be returned as



---


---
