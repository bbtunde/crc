var nr = require('newrelic');
var morgan = require('morgan');
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

  // activate cron
  if (((undefined != config.cron_active) && config.cron_active) &&
    ((undefined != config.couchbase) && config.couchbase.enabled)) {
    const cronService = require('./services/cronService');
    cronService.cronTaskPlansDSTV.start();
    cronService.cronTaskPlansGOTV.start();
    cronService.cronTaskPlansSTARTIMES.start();
    cronService.cronTaskPlansSMILE.start();
    cronService.cronTaskPlansMONTAGE.start();
  }

  // activate cache
 if ((undefined != config.couchbase) && config.couchbase.enabled && (undefined != config.plans_to_cache)) {
    const cacheService = require('./services/cacheService');
    cacheService.load(config.plans_to_cache);
  }

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

  //activate request logging
  morgan.token('payload', function (req, res) { return JSON.stringify(req.body) })
  logger = morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" ":payload"');
  server.on('after', function (req, res, route, error) {
    logger(req, res, function (error) {})
  });

  routes(server);

  server.listen(config.serverPort, function () {
    console.log(`Paga Adapter REST server listening at http://localhost:${config.serverPort}`);
  });
}

exports.server = server;
