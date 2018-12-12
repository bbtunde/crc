const config = require('../config/config.json');;
const request = require('request');
const xml2js = require('xml2js').parseString;
const AppError = require('./../models/AppError');
const AppResponse = require('./../models/AppResponse');
const ResponseCode = require('./../models/ResponseCode');



module.exports = class crcClient {


    static getInstance() {
        return (this._client) ? this._client : this._client = soap.createClientAsync(wsdlUrl);
    }

    static getSucessResponse(url, strRequest) {
        let form =
        {
            "strUserID": config.crc.user_id,
            "strPassword": config.crc.password,
            "strRequest": strRequest.toString()
        };

        return new Promise((resolve, reject) => {
            request.post({
                url: url,
                form: form,
                json: true,
            }, function (error, response, body) {
                
                crcClient.getResponseMessageToJSON(body)
                .then(jsonResponse =>{
                    
                        crcClient.getResponseMessageToJSON(jsonResponse.string._)
                        .then(responseJson =>
                            {
                                let crcResponse = responseJson.DATAPACKET.BODY[0];
                                if(crcResponse.hasOwnProperty("ERROR-LIST"))
                                {
                                    return reject(new AppError(500, ResponseCode.UNKNOWN_ERROR, `Error retrieving user details`, crcResponse));
                                }
                                return resolve(crcResponse);
                            })
                            .catch(appError => reject(appError))
                    })
                    .catch(appError => reject(appError))
                
                if (response.statusCode === 200) {

                } else {
                    return reject(error);
                }
            });

        });
    }


    static getResponseMessageToJSON(xmlMessage) {
        return new Promise((resolve, reject) => {
            try {

                xml2js(xmlMessage, function (err, result) {
                    /* istanbul ignore if  */
                    if (err) {
                        return reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Error converting crc XML to JSON ${err} `, []));
                    }
                    return resolve(result);
                });
            } catch (error) {
                reject(new AppError(400, ResponseCode.INVALID_REQUEST, `Error converting crc XML to JSON ${error} `, []));
            }
        });
    }


}
