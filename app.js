var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// Configure Passport
var passport = require('passport');
var expressSession = require('express-session');

var routes = require('./routes/index')(passport);
var users = require('./routes/users');
var tasks = require('./routes/tasks');

var app = express();

var flash = require('connect-flash');

// Initialize Passport
var initPassport = require('./passport/init');

///////////////////////////////////////////////////////////////////////////////
/**
 * Init - use SQLite or MongoDB
 * dbType = [mongo, sqlite]
 */
var dbType = "mongo";

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());

// Configure Passport and sessions
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());
initPassport(passport);

// Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', routes);
app.use('/tasks', tasks);

// Serve static files
// app.use(express.static(path.join(__dirname, '')))
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.static(path.join(__dirname, '/node_modules')));

// view engine setup
 app.set('views', path.join(__dirname, 'public'));
 app.set('view engine', 'jade');


// DATABASE CONNECTION

// MongoDB
  var dbConfig = require('./db.js');
  var mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
  // MongoDB - connect to DB
  mongoose.connect(dbConfig.url, function(err) {
    if (err) console.error(err);
  });

  // CONNECTION EVENTS
  // When successfully connected
  mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbConfig.url);
  });

  // If the connection throws an error
  mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', function() {
    mongoose.connection.close(function () {
      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
    })
  });



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).send('Something broke!');
  // res.render('error', {
  //   message: err.message,
  //   error: {}
  // });
});


module.exports = app;
