
const config = require('../config/config.json');
var couchbase = require('couchbase');
var cluster = new couchbase.Cluster(config.couchbase.cluster);

if (config.couchbase.username && config.couchbase.password) {
    cluster.authenticate(config.couchbase.username, config.couchbase.password);
}

var cache = cluster.openBucket(config.couchbase.bucket);

module.exports = class CacheService {

    /**
     * @param {string} key 
     */
    static get(key, callback) {
        try {
            return cache.get(key, function (e, result) {
                let value = (result !== null) ? result.value : false;
                callback.call(this, value);
            });
        } catch (err) {
            console.log(`Error retrieving key ${key} from cache log: ${err}`);
            callback.call(this, false);
        }
    }

    /**
     * @param {string} key 
     * @param {any} value 
     */
    static set(key, value) {
        try {
            cache.upsert(key, value, function (err, success) {
                if (err) {
                    console.log(`Error caching in ${key}, the value: ${value} log: ${err}`);
                }
                if (!err && success) {
                    console.log(`Successufly cached in ${key}, the value:`, value);
                }
            });
        } catch (err) {
            console.log(`Error saving key ${key} into cache log: ${err}`);
        }
    }

    /**
     * Loads cached from configured services
     */
    static async load(plansToCache) {
        var plansService = require('./plansService');
        for (const planToCache of plansToCache) {
            try {
                let plans = await plansService.getPlans(planToCache.linetype);
                this.set(planToCache.key, plans);
            } catch (appError) {
                console.log(`Error ocurred loading cache for plan: ${planToCache.linetype}`);
                console.log('Error cause:', appError);
            }
        }
    }
}
