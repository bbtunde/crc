module.exports = class QuoteResponse {
    /**
     * @param {String} destination 
     * @param {AdditionalDetailItem []} additionalDetails 
     * @param {PaymentDetailItem []} paymentDetails 
     * @param {String} successPurchaseMessage 
     */
    constructor(destination, additionalDetails, paymentDetails, successPurchaseMessage = null) {
        this.destination = destination;
        this.additional_details = additionalDetails;
        this.payment_details = paymentDetails;
        this.success_purchase_message = successPurchaseMessage;
    }
}
