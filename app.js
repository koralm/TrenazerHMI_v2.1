var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var io = require('socket.io');
//CUSTOM APPS
//SESSION
//var session = require('express-session');
var cookieSession = require('cookie-session');


//ROUTOWANIE STRON
var index = require('./routes/index');
var users = require('./routes/users');
var settings_advenced = require('./routes/settings_advenced');
var settings_save = require('./routes/settings_save');
var exercise = require('./routes/exercise');
var profiles_list = require('./routes/profiles_list');
var help = require('./routes/help');
var login = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//CUSTOM USE IN APP
//SESSION
// session = session({
//     secret: '$kx(Fj$uB!Ug!@jCkguFmc6f7t<c-e$9',
//     resave: false,
//     saveUninitialized: true
// })

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2', 'key3', 'key4', 'key5', 'key6'],
    secure: false,

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('$kx(Fj$uB!Ug!@jCkguFmc6f7t<c-e$9"'));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));

//app.use(session)

app.use(express.static(path.join(__dirname, 'public')));

//ADDED bower to server static
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'scrpits_custom')));
app.use(express.static(path.join(__dirname, 'media')));
app.use(express.static(path.join(__dirname, 'server_scripts')));



app.use('/', index);
app.use('/logowanie', login);
app.use('/users', users);
app.use('/ustawienia', settings_advenced);
app.use('/trening', exercise);
app.use('/trening/dzwiek_koniec', exercise);
app.use('/trening/up1', exercise);
app.use('/trening/down1', exercise);
app.use('/trening/up2', exercise);
app.use('/trening/down2', exercise);
app.use('/profile_cwiczen', profiles_list);
app.use('/profile_cwiczen/zaladuj_profile_cwiczen', profiles_list);
app.use('/pomoc', help);
app.use('/wyloguj', index);
app.use('/zapisz', settings_save);
app.use('/zapisz/zapisywanie', settings_save);
app.use('/zapisz/zapisywanie_LOGOUT', settings_save);
app.use('/zapisz/save_temp', settings_save);
app.use('/zapisz/save_tempE', settings_save);


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
