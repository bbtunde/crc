var MainController = require('../controllers/mainController');
var HealthController = require('../controllers/healthController');

module.exports = function (server) {

  server.get('/', HealthController.getHealth);
  server.post('/api/get_user', MainController.getUser);
};
