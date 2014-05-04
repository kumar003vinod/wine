module.exports = function(app,passport)
{
	var funclib = require('./funclib.js');
	
	//routes for application
	app.get('/',function(req, res){
		res.render('index.ejs',{
			user : req.user
		});
	});
	
	//PROFILE (can't view without login)
	app.get('/profile', isLoggedIn,function(req, res) {
		funclib.userProfile(req,res);
	});

	// LOGOUT
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// CHECKOUT (can't view with login)
	// show the login form
	app.get('/checkout', isLoggedIn,function(req, res) {
		res.render('checkout.ejs', { message: req.flash('loginMessage'),user:req.user });
	});

	// LOGIN (can't view with login)
	// show the login form
	app.get('/login', isNotLoggedIn,function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage'),user:req.user });
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
		res.render('signup.ejs', { message: req.flash('signupMessage'),user: req.user });
	});

	// process the signup form
	app.post('/signup', isNotLoggedIn, passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.get('/shoppingcart', isLoggedIn,function(req, res) {
		funclib.shoppingCart(res,req);
	});

	app.post('/removeitem', isLoggedIn,function(req, res) {
		funclib.removeItem(req,res);
	});


};


function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
}

function isNotLoggedIn(req, res, next) {
	if (!req.isAuthenticated())
		return next();
	res.redirect('/');
}

