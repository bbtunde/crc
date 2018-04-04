const mapper = {

    // TV

    TV_PAGA_DSTV: {
        lynetype: 'A3878DC1-F07D-48E7-AA59-8276C3C26647',
        service_key: 'tv.paga.dstv',
        destination: 'smart_card_number',
        has_plans:true,
        message_missing_destination: 'Missing Smart Card Number',
        order_summary_needs_prevalidation: true,
        prevalidation_error_message: 'Please make sure your operator and Smart Card number are correct. ' +
            'Otherwise, please check your account status with your operator.'
    },
    // INTERNET

    INTERNET_PAGA_SWIFT: {
        lynetype: '21e818c7-db0a-4042-bc7a-a18da33ec3e5',
        service_key: 'internet.paga.swift',
        destination: 'customer_id',
        has_plans:false,
        message_missing_destination: 'Missing Costumer ID',
        order_summary_needs_prevalidation: true, 
        prevalidation_error_message: 'Please make sure your customer ID is correct. ' +
            'Otherwise, please check your account status with your operator.'
    },
     INTERNET_PAGA_SMILE: {

        lynetype: 'E5E5CF1D-3F53-4273-83A7-6E678EBD7C15',
        service_key: 'internet.paga.smile',
        destination: 'customer_id',
        has_plans:true,
        message_missing_destination: 'Missing Costumer ID',
        order_summary_needs_prevalidation: true, 
        prevalidation_error_message: 'Please make sure your customer ID is correct. ' +
            'Otherwise, please check your account status with your operator.'
    }
};

const services = Object.keys(mapper);

/* istanbul ignore next */
module.exports.mapper = mapper;

/* istanbul ignore next */
module.exports.serviceDataByServiceKey = (argServiceKey) => {

    for (let i = 0; i < services.length; i++) {
        if (mapper[services[i]].service_key == argServiceKey) {
            return mapper[`${services[i]}`];
        }
    }

    return null;
}

/* istanbul ignore next */
module.exports.serviceKeys = () => {

    let serviceKeys = [];
    services.map(service => {
        serviceKeys.push(mapper[service].service_key);
    });

    return serviceKeys;
}
