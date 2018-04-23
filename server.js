
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var querystring = require('querystring');
var spawn = require('child_process').spawn;
global.spawn =spawn;

//////////////////////////// data base connection ////////////////////

var mysql =require('mysql');
var db =mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '1234',
	database: 'idoctor'
});
db.connect();
global.con =db;
////////////////////////////////////////////////////////////////////////


app.use(express.static('views'));

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: false })); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
 // session secret
 app.use(session({
	secret: 'ssasaashnyhajoinansiyh',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
  }))
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

module.exports = app;