var FormsController = require('../controllers/formsController');
var OrderController = require('../controllers/orderController');
var HealthController = require('../controllers/healthController');

module.exports = function (server) {

  server.get('/', HealthController.getHealth);
  
  server.get('/api/v1/', HealthController.getHealth);

  server.post('/api/v1/formtype/:service-key', FormsController.getFormType);

  server.post('/api/v1/ordersummary/:service-key', OrderController.orderSummary);

  server.post('/api/v1/makepurchase/:service-key', OrderController.makePurchase);
  
};
