var express = require('express');
var passport = require('passport');
var flash    = require('connect-flash');
var app = express();

require('./config/passport')(passport); // pass passport for configuration

app.configure(function(){
	app.use('/', express.static(__dirname + '/public'));//put css and javascript file in ./public
	app.use(express.logger("dev")); //use logger
	app.use(express.cookieParser());//for cookies
	app.use(express.bodyParser());// to parse html froms
	app.use(express.session({ secret: 'mysecretname' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
});

//import routes
require('./app/router.js')(app,passport);


app.listen(3000);

