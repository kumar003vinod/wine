module.exports = function(app,passport)
{
	var funclib = require('./funclib.js');
	
	//routes for application
	app.get('/',function(req, res){
	funclib.getItems(req,res);
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
		funclib.checkout(req,res);
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

	app.get('/wishlist', isLoggedIn,function(req, res) {
		funclib.wishlist(res,req);
	});

	app.post('/removecartitem', isLoggedInWarning,function(req, res) {
		funclib.removecartItem(req,res);
	});

	app.post('/removewishlistitem', isLoggedInWarning,function(req, res) {
		funclib.removeWishlistItem(req,res);
	});

	app.get('/productdetails',function(req, res) {
		funclib.getItemDetails(req,res);
	});
	

	app.post('/additem',isLoggedIn,function(req, res) {
		funclib.addItem(req,res);
	});

	app.post('/order',isLoggedIn,function(req, res) {
		funclib.PlaceOrder(req,res);
	});

	app.post('/updatecartitem', isLoggedIn,function(req, res) {
		funclib.updatecartItem(req,res);
	});

	app.get('/locate',function(req, res) {
		funclib.locateWineries(req,res);
	});

	app.get('/getdirection',function(req, res) {
		funclib.getDirection(req,res);
	});

	app.get('/getwineries',function(req, res) {
		funclib.getWineries(req,res);
	});

	app.get('/getwineryinfo',function(req, res) {
		funclib.getWineryinfo(req,res);
	});

	app.post('/getcomments',function(req, res) {
		funclib.getComments(req,res);
	});

	app.post('/addcomment',function(req, res) {
		funclib.addComment(req,res);
	});

	app.post('/addtowishlist',function(req, res) {
		funclib.addToWishlist(req,res);
	});
	app.post('/next',function(req,res) {
		funclib.next(req,res);
	});
	app.post('/prev',function(req,res) {
		funclib.prev(req,res);
	});
	app.post('/rate', isLoggedIn1,function(req, res) {
		funclib.rate(req,res);
	});
		app.get('/login1', isNotLoggedIn,function(req, res) {
		res.render('login1.ejs', { message: req.flash('loginMessage'),user:req.user });
	});
	app.post('/searchs',function(req,res) {
		funclib.searchs(req,res);
	});
	app.get('/products',function(req,res) {
		funclib.products(req,res);
	});

};


function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
}

function isLoggedInWarning(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.send("please <a href='/login'>login</a> to use this feature.");
}

function isNotLoggedIn(req, res, next) {
	if (!req.isAuthenticated())
		return next();
	res.redirect('/');
}
function isLoggedIn1(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login1');
}

