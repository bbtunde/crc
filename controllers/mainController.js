/* istanbul ignore next */
const ControllerUtils = require('./../services/controllerUtils');
const AppResponse = require('./../models/AppResponse');
const ResponseCode = require('./../models/ResponseCode');
const crcClient = require('./../services/crcClient');
const config = require('./../config/config.json');
const AppError = require('./../models/AppError');

/**
* @api {post} /api/v1/getuser
* @apiVersion 1.0.0
* @apiName GetUser
* @apiGroup User
* @ApiDescription Get details about a user
* @apiUse GetUserWithBVN
* @apiUse GetUserWithPhone
* @apiUse GetUserWithAccount
* @apiUse GetUserWithName
* @apiUse GetUserWithBVNResponse
* @apiUse GetUserWithPhoneResponse
* @apiUse GetUserWithNameResponse
* @apiUse GetUserErrorResponse
* @apiUse GetUserError
* @apiUse GetUserError1
*/
function getUser(request, response, next) {
  try {
    // authenticate request
    if (!ControllerUtils.isRequestWithValidCredentials(request)) {
      return next(response.json(401, new AppResponse(ResponseCode.INVALID_AUTHENTICATION, "Header must contain valid username and password", [])));
    }

    // validate not empty body
    if (!ControllerUtils.isRequestWithValidBody(request)) {
      return next(response.json(400, new AppResponse(ResponseCode.INVALID_BODY, "Request must contain a valid body", [])));
    }

    let body = request.body;
    let validSearchType = ["bvn", "phone_number", "account", "normal"];
    let valid = true;
    search_parameters =
      `<REQUEST REQUEST_ID="1">
      <REQUEST_PARAMETERS>
        <REPORT_PARAMETERS RESPONSE_TYPE="1" SUBJECT_TYPE="1" REPORT_ID="104"/>
        <INQUIRY_REASON CODE="1"/>
        <APPLICATION CURRENCY="NGN" AMOUNT="0" NUMBER="0" PRODUCT="017"/>
     </REQUEST_PARAMETERS>`;


    if (body.search_type == undefined) {
      let appError = new AppError(400, ResponseCode.INVALID_REQUEST, "Search type is required", [{ 'search_type': "is required" }]);
      ControllerUtils.sendErrorResponse(appError, response, next);
    }

    else if (!validSearchType.includes(body.search_type)) {
      let appError = new AppError(400, ResponseCode.INVALID_REQUEST, " Invalid Search type can only be ['bvn','phone_number','account','normal'] ", [{ 'search_type': "Invalid search type" }]);
      sendErrorResponse(appError, response, next);
    }
    let search_type = body.search_type;

    if (search_type == "normal" || search_type == "account") {
      if (body.name == undefined) {
        let appError = new AppError(400, ResponseCode.INVALID_REQUEST, `name is required for search_type ${search_type} `, [{ 'name': "Name is required" }]);
        ControllerUtils.sendErrorResponse(appError, response, next);
        valid = false;

      }
    }

    if (search_type == "normal") {
      if (body.gender == undefined) {
        let appError = new AppError(400, ResponseCode.INVALID_REQUEST, `gender is required for search_type ${search_type} `, [{ 'gender': "Gender is required" }]);
        ControllerUtils.sendErrorResponse(appError, response, next);
        valid = false;

      }
      else if (body.gender != "001" && body.gender != "002") {
        let appError = new AppError(400, ResponseCode.INVALID_REQUEST, `Invalid gender 001 for Male and 002 for Female`, [{ 'gender': "Invalid" }]);
        ControllerUtils.sendErrorResponse(appError, response, next);

      }
      else if (body.dob == undefined) {
        let appError = new AppError(400, ResponseCode.INVALID_REQUEST, `dob is required for search_type ${search_type} `, [{ 'dob': "Date of birth is required" }]);
        ControllerUtils.sendErrorResponse(appError, response, next);
        valid = false;

      }
      else {

        search_parameters +=
          ` <SEARCH_PARAMETERS SEARCH-TYPE="0">
              <NAME>${body.name}</NAME>
              <SURROGATES>
                  <GENDER VALUE="${body.gender}"/>
                  <DOB VALUE="${body.dob}"/>
              </SURROGATES>
            </SEARCH_PARAMETERS>`;
      };
    }

    else if (search_type == "account") {


      if (body.account_number == undefined) {
        let appError = new AppError(400, ResponseCode.INVALID_REQUEST, `Account number is required for search_type ${search_type} `, [{ 'account_number': "Account is required" }]);
        ControllerUtils.sendErrorResponse(appError, response, next);
        valid = false;

      }
      if (body.branch_code == undefined) {
        let appError = new AppError(400, ResponseCode.INVALID_REQUEST, `Branch code is required for search_type ${search_type} `, [{ 'branch_code': "  Branch Code is required" }]);
        ControllerUtils.sendErrorResponse(appError, response, next);
        valid = false;

      }
      else {

        search_parameters +=
          ` <SEARCH_PARAMETERS SEARCH-TYPE="1">
              <NAME>${body.name}</NAME>
              <ACCOUNT NUMBER="${body.account_number}" BRANCH-CODE="${body.branch_code}"/>
            </SEARCH_PARAMETERS>`;

      };

    }


    else if (search_type == "phone_number") {

      let telephone = body.telephone;
      if (telephone == undefined) {
        let appError = new AppError(400, ResponseCode.INVALID_REQUEST, `Telephone is required for search_type ${search_type} `, [{ 'telephone': "Telephone is required" }]);
        ControllerUtils.sendErrorResponse(appError, response, next);
        valid = false;

      }

      else if (telephone.length != 11) {
        let appError = new AppError(400, ResponseCode.INVALID_REQUEST, `Inavalid telephone `, [{ 'telephone': "Invalid Telephone" }]);
        ControllerUtils.sendErrorResponse(appError, response, next);
        valid = false;
      }
      else {
        search_parameters +=
          ` <SEARCH_PARAMETERS SEARCH-TYPE="5">
            <TELEPHONE_NO>${telephone}</TELEPHONE_NO>
          </SEARCH_PARAMETERS> `;

      }
    }


    else if (search_type == "bvn") {
      let bvn = body.bvn;
      if (bvn == undefined) {
        let appError = new AppError(400, ResponseCode.INVALID_REQUEST, `Bvn is required for search_type ${search_type} `, [{ 'bvn': "Bvn is required" }]);
        sendErrorResponse(appError, response, next);
        valid = false;

      }


      else {

        search_parameters +=
          ` <SEARCH_PARAMETERS SEARCH-TYPE="4">
            <BVN_NO>${bvn}</BVN_NO>
          </SEARCH_PARAMETERS> `;
      };
    }
    
    search_parameters += `</REQUEST>`;
    //make request here

    if (valid) {
      crcClient.getSucessResponse(config.crc.endpoint, search_parameters)
        .then(result => {
          return next(response.json(200, new AppResponse(ResponseCode.SUCCESS, result, [])));

        })
        .catch(error => {
          ControllerUtils.sendErrorResponse(error, response, next);
        });
    }

  }

  catch (e) {
    return ControllerUtils.sendErrorResponse(e, response, next);
  }
}

function sendErrorResponse(error, response, next) {
  console.log(error);
  if (error instanceof AppError) {
    return next(response.json(error.httpStatusCode, new AppResponse(error.code, error.response, error.errors)));
  } else {

    return next(response.json(500, new AppResponse(ResponseCode.UNKNOWN_ERROR, { "errorMessage": `Unkown error ocurred. Check server console log. Timestamp: ${Date.now()}` }, [])));
  }
}


exports.getUser = getUser;
