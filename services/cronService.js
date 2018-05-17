var cron = require('node-cron');
const config = require('../config/config.json');
const plansService = require('./plansService');
const CacheService = require('./cacheService');

var cronTaskPlansDSTV = cron.schedule('0 0,12 * * *', function() {
    console.log('Trying to retrieve plans for DSTV...');
    plansService.getPlans("A3878DC1-F07D-48E7-AA59-8276C3C26647")
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
    plansService.getPlans("D66C40A6-CA65-4CF7-88A1-BDF748CF0627")
    .then(plans => {
        CacheService.set('GOTV', plans);
        console.log('Plans for GOTV successfully cached!');
    })
    .catch(appError => {
        console.log('Error retrieving plans for GOTV. Plans will not be cached');
        console.log('Error cause:', appError);
    }); 

}, false);


var cronTaskPlansSMILE = cron.schedule('0 0,12 * * *', function() {
    console.log('Trying to retrieve plans for SMILE...');
    plansService.getPlans("E5E5CF1D-3F53-4273-83A7-6E678EBD7C15")
    .then(plans => {
        CacheService.set('SMILE', plans);
        console.log('Plans for SMILE successfully cached!');
    })
    .catch(appError => {
        console.log('Error retrieving plans for SMILE. Plans will not be cached');
        console.log('Error cause:', appError);
    }); 

}, false);


module.exports.cronTaskPlansSMILE = cronTaskPlansSMILE;
module.exports.cronTaskPlansDSTV = cronTaskPlansDSTV;
module.exports.cronTaskPlansGOTV = cronTaskPlansGOTV;

