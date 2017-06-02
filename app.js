var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');

//CUSTOM APPS
//SESSION
var session = require('express-session');



//ROUTOWANIE STRON
var index = require('./routes/index');
var users = require('./routes/users');
var settings_advenced = require('./routes/settings_advenced');
var settings_save = require('./routes/settings_save');
var exercise = require('./routes/exercise');
var profiles_list = require('./routes/profiles_list');
var help = require('./routes/help');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));



app.use(express.static(path.join(__dirname, 'public')));

//ADDED bower to server static
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'scrpits_custom')));
app.use(express.static(path.join(__dirname, 'media')));

//CUSTOM USE IN APP
//SESSION
session = session({
    secret: 'trenazer_secer_SECRET',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
})
app.use(session);

app.use('/', index);
app.use('/wyloguj', index);
app.use('/zaloguj', index);
app.use('/users', users);
app.use('/ustawienia', settings_advenced);
app.use('/ustawienia_OK', settings_save);
app.use('/zapisz', settings_save);
app.use('/trening', exercise);
app.use('/profile_cwiczen', profiles_list);
app.use('/pomoc', help);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
