// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var mysql = require('mysql');

//connect to database
var connection = mysql.createConnection({
    user: "root",
    password: "vinod",
    database: "test"
});

connection.connect(function(err) {
	// connected! (unless `err` is set)
	if (!err)
	{
		//connection is successful
		//console.log('database connected');
	}
	else
	{
		console.log(err.code); // 'ECONNREFUSED'
		console.log(err.fatal); // true
	}
});

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		sql = 'SELECT * FROM users WHERE id = '+id+';';
		connection.query(sql,function (error, rows, fields)
		{
			if(error) throw error;
			if(rows.length>0)
			{
				var user = {};
				user.id = rows[0].id;
				user.email = rows[0].email;
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
		
		sql = 'SELECT * FROM users WHERE email = '+connection.escape(email)+' AND password = "'+password+'";';
		connection.query(sql,function (error, rows, fields)
		{
			if(error) throw error;
			if(rows.length>0)
			{
				var user = {};
				user.id = rows[0].id;
				user.email = rows[0].email;
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
			var sql = 'SELECT * FROM users WHERE email = '+connection.escape(email)+';';
			connection.query(sql,function (error, rows, fields)
			{
				if(error) throw error;
				if(rows.length>0)
						return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
				else
				{
					// create the user
					connection.query('INSERT INTO users (email,password) VALUES('+connection.escape(email)+',"'+password+'");',function (error, rows, fields)
					{
						if(error) throw error;
						var sql = 'SELECT * FROM users WHERE email = '+connection.escape(email)+';';
						connection.query(sql,function (error, rows, fields)
						{
							if(error) throw error;
							var user = {};
							user.id = rows[0].id;
							user.email = rows[0].email;
							return done(null, user);
						});
					});
				}
			});
			
	}));

};
