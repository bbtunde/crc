const mapper = {

    // INTERNET

    TV_PAGA_DSTV: {
        lynetype: 'A3878DC1-F07D-48E7-AA59-8276C3C26647',
        service_key: 'tv.paga.dstv',
        destination: 'smart_card_number',
        has_plans:true,
        message_missing_destination: 'Missing Smart Card Number',
        order_summary_needs_prevalidation: true,
        prevalidation_error_message: 'Please make sure your operator and Smart Card number are correct. ' +
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
