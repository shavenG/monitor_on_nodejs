
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , services = require('./routes/service')
  , http = require('http')
  , path = require('path');

BG = require('monitor/background.js')
$ = require('jquery');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

RELIABLE_CHECKPOINT = "http://www.baidu.com/";
DEFAULT_CHECK_INTERVAL = 108E5;
RESCHEDULE_DELAY = 9E5;
MINIMUM_CHECK_SPACING = 1E3;
BROWSER_ICON = "img/browser_icon.png";
EPSILON = 500;
WATCHDOG_INTERVAL = 9E5;
WATCHDOG_TOLERANCE = 12E4;

var sqlite3 = require('sqlite3').verbose();
db = new sqlite3.Database('databases/monitor.db');
dao = require("monitor/dao.js");
// dao = monitor.dao;
// dao.setBG(monitor);
console.log(this)
app.get('/', routes.index);
app.get('/users', user.list);

app.get('/services/:method',function(req,res){
  services[req.params.method](req, res);
});

BG.watchdog();

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
