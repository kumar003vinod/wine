module.exports = function(app,passport)
{
	//routes for application
	app.get('/',function(req, res){
		res.render('index.ejs');
	});
	
	//PROFILE (can't view without login)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user
		});
		console.log("email = "+req.user.email);
	});

	// LOGOUT
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// LOGIN (can't view with login)
	// show the login form
	app.get('/login', isNotLoggedIn,function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', isNotLoggedIn, passport.authenticate('local-login', {
		successRedirect : '/', // redirect to home
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// SIGNUP (can't view with login)
	// show the signup form
	app.get('/signup', isNotLoggedIn,function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', isNotLoggedIn, passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));


};


function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

function isNotLoggedIn(req, res, next) {
	if (!req.isAuthenticated())
		return next();
	res.redirect('/');
}

