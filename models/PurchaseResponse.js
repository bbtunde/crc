module.exports = class PurchaseResponse {
    /**
     * @param {String} transactionReference 
     * @param {Object} distributorResponse 
     * @param {String} extraInfo
     */
    constructor(transactionReference, distributorResponse, extraInfo) {
        this.transaction_reference = transactionReference;
        this.distributor_response = distributorResponse;
        this.extra_info = extraInfo;
    }
} 
