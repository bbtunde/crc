module.exports = class AppResponse {
    /**
     * @param {ResponseCode} code 
     * @param {Object} response 
     * @param {Object []} errors 
     */
    constructor(code, response, errors) {
        this.code = code;
        this.response = response;
        this.errors = errors
    }
} 
