const PurchaseResponse = require('./../models/PurchaseResponse');

/* istanbul ignore next */
module.exports = {

    noPurchaseHandler: function(serviceKey, body) {
        return new Promise((resolve, reject) => {
            let mockDistributorResponse = {
                status: 'Success',
                balance: 0
            };
            let purchaseResponse = new PurchaseResponse('mock_reference', mockDistributorResponse, 'mock_message','mock_generated_reference');
            return resolve(purchaseResponse);
        });
    }
}
