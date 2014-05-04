// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;

//connect to database
var dbauth = require('./dbauth.js');
var connection = dbauth.NewDatabaseConnection();

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user.user_id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(user_id, done) {
		sql = 'SELECT * FROM users WHERE user_id = '+user_id+';';
		connection.query(sql,function (error, rows, fields)
		{
			if(error) throw error;
			if(rows.length>0)
			{
				var user = {};
				user.user_id = rows[0].user_id;
				user.username = rows[0].username;
				done(null, user);
			}
		});
	});

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
		
		sql = 'SELECT * FROM users WHERE username = '+connection.escape(email)+' AND password = "'+password+'";';
		connection.query(sql,function (error, rows, fields)
		{
			if(error) throw error;
			if(rows.length>0)
			{
				var user = {};
				user.user_id = rows[0].user_id;
				user.username = rows[0].username;
				return done(null, user);
			}
			else
				return done(null, false, req.flash('loginMessage', 'Unknown user or incorrect password'));
		});

    }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
	function(req, email, password, done) {
		if(email)
			email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

//if user is already logged-in
			
			//check to see if theres already a user with that email
			var sql = 'SELECT AddUser('+connection.escape(email)+','+connection.escape(password)+',"user") AS result';
			connection.query(sql,function (error, rows, fields)
			{
				if(error) throw error;
				if(rows[0].result==0)
				{
					return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
				}
				else
				{
					var user = {};
					user.user_id = rows[0].result;
					user.username = email;
					return done(null, user);
				}
			});
	}));

};

