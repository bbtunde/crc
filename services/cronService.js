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


var cronTaskPlansSPECTRANET = cron.schedule('0 0,12 * * *', function() {
    console.log('Trying to retrieve plans for SPECTRANET...');
    plansService.getPlans("F3B9CE63-3FB4-468B-83CE-2E3A0E2C8853")
    .then(plans => {
        CacheService.set('SPECTRANET', plans);
        console.log('Plans for SPECTRANET successfully cached!');
    })
    .catch(appError => {
        console.log('Error retrieving plans for SPECTRANET. Plans will not be cached');
        console.log('Error cause:', appError);
    }); 

}, false);

 
module.exports.cronTaskPlansDSTV = cronTaskPlansDSTV;
module.exports.cronTaskPlansSPECTRANET = cronTaskPlansSPECTRANET;
