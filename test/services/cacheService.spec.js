var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');
var rewire = require('rewire');
var AppError = require('../../models/AppError');
const TestHelper = require('./../testHelper');
const CacheService = require('./../../services/cacheService');
const PlansService = require('./../../services/plansService');


var SMILEPlansMock=[
  { ProductName: [ 'DStv FTA Plus' ], ProductAmount: [ '1600' ] },
  { ProductName: [ 'DStv Access' ], ProductAmount: [ '1900' ] },
  { ProductName: [ 'DStv Family' ], ProductAmount: [ '3800' ] },
  { ProductName: [ 'DStv Compact' ], ProductAmount: [ '6300' ] },
  { ProductName: [ 'DStv Compact Plus' ],
    ProductAmount: [ '9900' ] },
  { ProductName: [ 'DStv Premium' ], ProductAmount: [ '14700' ] },
  { ProductName: [ 'DStv Access + HDPVR/XtraView' ],
    ProductAmount: [ '4100' ] },
  { ProductName: [ 'DStv Family + HDPVR/XtraView' ],
    ProductAmount: [ '6000' ] },
  { ProductName: [ 'DStv Compact + HDPVR/XtraView' ],
    ProductAmount: [ '8500' ] },
  { ProductName: [ 'DStv Compact Plus + HDPVR/XtraView' ],
    ProductAmount: [ '12100' ] },
  { ProductName: [ 'DStv Premium + HDPVR/XtraView' ],
    ProductAmount: [ '16900' ] } 
];
        



describe('Cache Service', function () {

    it('CacheService.get', async () => {
        let key="SMILE";
        let cacheReturn= {'callback':function(plans){}};
        let callBackSpy = sinon.spy(cacheReturn, 'callback');
        CacheService.get(key,cacheReturn.callback);
        setTimeout(function() {
        assert.isTrue(callBackSpy.calledWith(SMILEPlansMock));
        TestHelper.resetStubAndSpys([callBackSpy]);
        done();
      }, 10);
        
    });

    it('CacheService.set', async () => {
       let key="SMILE";
       let cacheServiceStub=sinon.spy(CacheService,'set');
        CacheService.set(key,SMILEPlansMock);
        assert.isTrue(cacheServiceStub.calledWith(key,SMILEPlansMock));
        TestHelper.resetStubAndSpys([cacheServiceStub]);
    });
    

    it('CacheService.load', async () => {
        let plansToCache=[
            {
              "key": "SMILE",
              "linetype": "E5E5CF1D-3F53-4273-83A7-6E678EBD7C15"
            }
            
        ];
        
        var getPlanStub = sinon.stub(PlansService, "getPlans");
        getPlanStub.resolves(SMILEPlansMock);
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
