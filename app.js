var nr = require('newrelic');
var restify = require('restify');
var restifyValidator = require('restify-validator');
var errs = require('restify-errors');
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config.json');
var routes = require('./routes/routes');

const corsMiddleware = require('restify-cors-middleware')

const cors = corsMiddleware({
  preflightMaxAge: 5,
  origins: ['*'],
  allowHeaders: ['X-AUTH-API-KEY', 'X-AUTH-API-SECRET', 'Access-Control-Allow-Origin'],
  exposeHeaders: []
})

var server = {};

if (env !== 'test') {

  server = restify.createServer();

  server.use(restify.plugins.bodyParser());
  server.use(restify.plugins.queryParser());
  server.use(restifyValidator);
  server.pre(cors.preflight);
  server.use(cors.actual);
  server.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });

  server.on('NotFound', function (req, res, err, cb) {
    res.send(404, {
      code: 'NOT_FOUND',
      response: err.message
    });
  });

  server.on('InternalServer', function (req, res, err, cb) {
    res.send(500, {
      code: 'UNKNOWN_ERROR',
      response: err.message
    });
  });

  server.on('restifyError', function (req, res, err, cb) {
    res.send(500, {
      code: 'UNKNOWN_ERROR',
      response: err.message
    });
  });

  routes(server);

  server.listen(config.serverPort, function () {
    console.log(`Paga Adapter REST server listening at http://localhost:${config.serverPort}`);
  });
}

exports.server = server;
