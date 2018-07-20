module.exports = class PurchaseResponse {
    /**
     * @param {String} transactionReference 
     * @param {Object} distributorResponse 
     * @param {String} extraInfo
     * @param {String} generatedReference
     */
    constructor(transactionReference, distributorResponse, extraInfo, generatedReference = "") {
        this.transaction_reference = transactionReference;
        this.distributor_response = distributorResponse;
        this.extra_info = extraInfo;
        this.generated_reference = generatedReference;
    }
} 
