var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');
var rewire = require('rewire');
var AppError = require('../../models/AppError');
const TestHelper = require('./../testHelper');
const CacheService = require('./../../services/cacheService');
const PlansService = require('./../../services/plansService');


var DSTVPlansMock=[
  { name: 'ACCESS',
    code: 'ACSSW4',
    price: 1500, 
    shortCode: 'ACC' },
  { name: 'FAMILY',
    code: 'COFAMW4',
    price: 3000, 
    shortCode: 'FAM' },
  { name: 'MINI',
     code: null, 
     price: 5000, 
     shortCode: 'MIN' },
  { name: 'PREMIUM',
    code: null,
    price: 15000,
    shortCode: 'PRE' }
];
        

  
describe('Cache Service', function () {

    it('CacheService.get', async () => {
        let key="DSTV";
        let cacheReturn= {'callback':function(plans){}};
        let callBackSpy = sinon.spy(cacheReturn, 'callback');
        CacheService.get(key,cacheReturn.callback);
        setTimeout(function() {
        assert.isTrue(callBackSpy.calledWith(DSTVPlansMock));
        TestHelper.resetStubAndSpys([callBackSpy]);
        done();
      }, 10);
        
    });

    it('CacheService.set', async () => {
       let key="DSTV";
       let cacheServiceStub=sinon.spy(CacheService,'set');
        CacheService.set(key,DSTVPlansMock);
        assert.isTrue(cacheServiceStub.calledWith(key,DSTVPlansMock));
        TestHelper.resetStubAndSpys([cacheServiceStub]);
    });
    

    it('CacheService.load', async () => {
        let plansToCache=[
            {
              "key": "DSTV",
              "linetype": "A3878DC1-F07D-48E7-AA59-8276C3C26647"
            }
            
        ];
        
        var getPlanStub = sinon.stub(PlansService, "getPlans");
        getPlanStub.resolves(DSTVPlansMock);
        let cacheServiceStub=sinon.stub(CacheService,'set');
        CacheService.load(plansToCache);
        setTimeout(function() {
        assert.isTrue(cacheServiceStub.callCount=plansToCache.length);
        TestHelper.resetStubAndSpys([isRequestWithValidCredentialsStub,
          getPlanStub,
          cacheServiceStub
        ]);
        done();
      }, 10);
        
        
    });
})
