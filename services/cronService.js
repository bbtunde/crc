var cron = require('node-cron');
const config = require('../config/config.json');
const plansService = require('./plansService');
const CacheService = require('./cacheService');

var cronTaskPlansDSTV = cron.schedule('0 0,12 * * *', function() {
    console.log('Trying to retrieve plans for DSTV...');

    plansService.getPlans('DSTV', config.smart_card_number_DSTV)
    .then(plans => {
        CacheService.set('DSTV', plans);
        console.log('Plans for DSTV successfully cached!');
    })
    .catch(appError => {
        console.log('Error retrieving plans for DSTV. Plans will not be cached');
        console.log('Error cause:', appError);
    }); 

}, false);

var cronTaskPlansGOTV = cron.schedule('0 0,12 * * *', function() {
    console.log('Trying to retrieve plans for GOTV...');

    plansService.getPlans('GOTV', config.uic_number_GOTV)
    .then(plans => {
        CacheService.set('GOTV', plans);
        console.log('Plans for GOTV successfully cached!');
    })
    .catch(appError => {
        console.log('Error retrieving plans for GOTV. Plans will not be cached');
        console.log('Error cause:', appError);
    }); 

}, false);
 
module.exports.cronTaskPlansDSTV = cronTaskPlansDSTV;
module.exports.cronTaskPlansGOTV = cronTaskPlansGOTV;