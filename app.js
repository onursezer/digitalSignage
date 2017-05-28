/*

Author : Onur SEZER
 
*/

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var cons = require('consolidate');
var connection = require("./lib/connection");
var routes = require('./routes/index');
var fields = require('./routes/fields');
var playlistler = require('./routes/playlistler');
var fileUpload = require("./routes/fileUpload");
var client = require("./routes/client");
var Fields = require("./models/fields");

// Init App
var app = express();


// Set Static Folder
app.set('views', __dirname + '/views');
app.engine('jade', cons.jade);
app.engine('html', cons.handlebars);


app.use(express.static(path.join(__dirname, 'public')));
app.use("/public", express.static(path.join(__dirname, 'public')));

if (app.get('env') == 'development') {
  app.locals.pretty = true;
}


// //View Engine
// app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Express Session
app.use(session({
  secret: 'sadasdsdasdsadscasas',
  saveUninitialized: true,
  resave: true
}));


// Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


app.post('/pyt', function (req, res, next) {

  console.log("girdi");
  console.log(req.body);


  var isim = req.body.sender;
  var personCount = req.body.count;
  Fields.count({ "isim": isim }, function (err, sayi) {
    if (sayi == 0) {
      res.send({ status: 'FAIL' });
      console.log("bulunamdi");
    } else {
      console.log("bulundu");
      Fields.findOneAndUpdate({ "isim": isim }, { $set: { "personCount": personCount } }, function (err, sonuc) {

        if (err) {
          res.send({ status: 'FAIL' });
          console.log("fail");
        } else {
          res.send({ status: 'SUCCESS' });
          console.log("SUCCESS");
        }

      });

    }
  });

});



app.use('/', routes);
app.use('/', fields);
app.use('/', playlistler);
app.use('/', fileUpload);
app.use('/', client);
app.use("/", function (req, res) {
  res.render("hata_sayfasi.handlebars", { title: "digitalBilgiEkraniPanel" });
});


// Set Port
app.set('port', (process.env.PORT || 6060));

app.listen(app.get('port'), function () {
  console.log('Server ' + app.get('port') + " portundan başlatıldı.");
});