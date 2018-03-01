const request=require('request');
const crypto=require('crypto');
const config = require('../config/config.json');
const AppError = require('./../models/AppError');
const ResponseCode = require('./../models/ResponseCode');

module.exports = class pagaClient {

    static isSuccessResponse(response) {
        if ((response.responseCode == undefined) || (response.responseCode == undefined)) {
            return false;
        }

        if ((response.responseCode == 0) || (response.responseCode == "0")) {
            return true;
        }

        return false;
    }

    /* istanbul ignore next */
    static getSuccessMessage(url,args,tohash) {
        var pagaClient = this;
        return new Promise((resolve, reject) => {
            
            const sha512 = crypto.createHash('sha512');
            tohash=tohash+config.paga.hashkey;
            var hash= sha512.update(tohash).digest('hex');
            
            request.post({
                url: url,
                headers:{
                    'principal':config.paga.principal,
                    'credentials':config.paga.credentials,
                    'hash':hash,
                    'Content-Type':'application/json'
                },
                body: args,
                json:true,
            }, function(error, response, body){
                
                if (response.statusCode === 200) {
                    if (pagaClient.isSuccessResponse(body)) {
                        return resolve(body);
                    } else {
                        return reject(new AppError(500, ResponseCode.SERVICE_TEMPORARILY_UNAVAILABLE, body.message, []));
                    }

                } else {
                    let errorMessage=body.errorMessage===undefined ? error:body.errorMessage;
                    return reject(new AppError(500, ResponseCode.SERVICE_TEMPORARILY_UNAVAILABLE,errorMessage , []));
                }
            });

        });
    };
}
