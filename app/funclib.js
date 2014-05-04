//connect to database
var dbauth = require('../config/dbauth.js');
var connection = dbauth.NewDatabaseConnection();

//function to return userprofile
function userProfile(req,res)
{
	var profile = {};
	var sql = 'SELECT * FROM profile WHERE user_id = '+(req.user).user_id+';';
	connection.query(sql,function (error, rows, fields)
	{
		if(error) throw error;
		if(rows.length>0)
		{
			profile.user_id = rows[0].user_id;
			profile.fname = rows[0].fname;
			profile.lname = rows[0].lname;
			profile.email = rows[0].email;
			profile.contact_no = rows[0].contact_no;
			
			res.render('profile.ejs', {
				user : req.user,
				profile: profile
			});
			
		}
	});
}

exports.userProfile = userProfile;

function shoppingCart(res,req)
{
	var sql = 'SELECT cart.id,wine.name,cart.quantity,wine.price from cart inner join  wine on cart.wine_id = wine.wine_id WHERE user_id = '+(req.user).user_id+';';
	connection.query(sql,function (error, rows, fields)
	{
		res.render('shoppingcart.ejs', {
			user : req.user,
			total_items: rows.length,
			items: rows
			});
	});
	
}

exports.shoppingCart = shoppingCart;

function removeItem(req,res)
{
	var sql = 'DELETE FROM cart WHERE id = '+req.body.id;
	console.log("ssssss");
	connection.query(sql,function (error, rows, fields)
	{
		console.log("ssssss");
		if(error) throw error;
		res.send("item removes successfully\n");
	});
}
exports.removeItem = removeItem;


