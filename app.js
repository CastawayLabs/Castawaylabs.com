/*
 *
 */

// requires, requires
var express = require('express'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    less = require('less-middleware'),

    // route up!
    routes = require('./routes/index'),

    // the app object.
    app = express();

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use(less(path.join(__dirname, 'assets', 'less'), {
  compiler: {
    yuicompress: app.get('env') === 'development' ? false : true
  },
  debug: app.get('env') === 'development' ? true : false,
  dest: path.join(__dirname, 'assets'),
  force: app.get('env') === 'development' ? true : false,
  once: app.get('env') === 'production' ?  true : false,

  preprocess: {
    path: function (pname, req) {
      if (path.sep === '\\') {
        return pname.replace('\\css\\', '\\');
      } else {
        return pname.replace('\/css\/', '\/');
      }
    }
  }
}));

app.use(express.static(path.join(__dirname, 'assets')));

app.use(function(req, res, next) {
    if (!req.secure) {
        res.redirect(301, 'https://' + req.get('host') + req.originalUrl).end();
    } else {
        next();
    }
});

app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
