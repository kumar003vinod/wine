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
	var sql = 'SELECT cart.id,cart.wine_id,wine.name,cart.quantity,wine.price from cart inner join wine on wine.wine_id = cart.wine_id WHERE user_id = '+(req.user).user_id+';';
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

function wishlist(res,req)
{
	var sql = 'SELECT wine.wine_id,wine.name,wine.price from wishlist inner join wine on wishlist.wine_id = wine.wine_id WHERE user_id = '+(req.user).user_id+';';
	connection.query(sql,function (error, rows, fields)
	{
		res.render('wishlist.ejs', {
			user : req.user,
			total_items: rows.length,
			items: rows
			});
	});
	
}
exports.wishlist = wishlist;

function removecartItem(req,res)
{
	if(req.user)
	{
		var sql = 'DELETE FROM cart WHERE id = '+req.body.id;
		connection.query(sql,function (error, rows, fields)
		{
			console.log(sql);
			if(error) throw error;
			res.send("");
		});
	}
	else
	{
		res.send("please <a href='/login'>login</a> to use this feature.");
	}
}
exports.removecartItem = removecartItem;


function removeWishlistItem(req,res)
{
	if(req.user)
	{
		var sql = 'DELETE FROM wishlist WHERE user_id = '+req.user.user_id+ ' AND wine_id = '+req.body.id;
		connection.query(sql,function (error, rows, fields)
		{
			if(error) throw error;
			res.send("");
		});
	}
	else
	{
		res.send("please <a href='/login'>login</a> to use this feature.");
	}
}
exports.removeWishlistItem = removeWishlistItem;


function updatecartItem(req,res)
{
	var sql = 'UPDATE cart SET quantity = '+req.body.quantity+' WHERE id = '+req.body.id;
	connection.query(sql,function (error, rows, fields)
	{
		if(error) throw error;
		res.send("<img src='images/green_good.png' alt='Updated' height='24' width='24'><br/>Updated");
	});
}
exports.updatecartItem = updatecartItem;

function getItems(req,res)
{
	var sql = 'SELECT wine_id,name,price from wine LIMIT 8';
	connection.query(sql,function (error, rows, fields)
	{
		if(error) throw error;
		res.render('index.ejs',{
			user : req.user,
			items : rows
		});
		
	});
}
exports.getItems = getItems;


function addItem(req,res)
{
	var sql = 'INSERT INTO cart (user_id,wine_id,quantity)VALUES('+req.user.user_id+','+req.body.wine_id+','+req.body.quantity+')';
	connection.query(sql,function (error, rows, fields)
	{
		if(error) throw error;
		res.send("<h4><img src = 'images/green_good.png'/> Added to <a href = '/shoppingcart'> cart</a><h4>");
	});
}
exports.addItem = addItem;


function getItemDetails(req,res)
{
	if(req.query.id == undefined)
	{
			res.render('error.ejs',{
				user : req.user
			});
	}
	else
	{
		var sql = 'SELECT wine.wine_id, wine.name AS wine_name,wine.mnf_date,wine.other_info,wine.per_alc,price,company.name As company_name from wine INNER JOIN company on wine.company_id = company.company_id WHERE wine_id = '+req.query.id;
		connection.query(sql,function (error, rows, fields)
		{
			if(error) throw error;
			if(!rows[0])
			{
				res.render('error.ejs',{
					user : req.user
				});
			
			}
			else
			{
				var details = rows;
				if(req.user)
				{
					var sql = 'SELECT * FROM cart WHERE user_id = '+req.user.user_id+' AND wine_id = '+req.query.id;
					connection.query(sql,function (error, rows, fields)
					{
						if(error) throw error;
						if(rows.length>0)
							incart = true;
						else
							incart = false;
						
						var sql = 'SELECT * FROM wishlist wishlist WHERE user_id = '+req.user.user_id+ ' AND wine_id = '+req.query.id;
						connection.query(sql,function (error, rows, fields)
						{
							var in_wishlist;
							if(error) throw error;
							if(rows.length>0)
								in_wishlist = true;
							else
								in_wishlist = false;
					
							res.render('productdetail.ejs',{
								user : req.user,
								details : details,
								incart: incart,
								in_wishlist:in_wishlist
							});
						});
					});
				}
				else
				{
					res.render('productdetail.ejs',{
						user : req.user,
						details : details,
						incart : false
						});
				}
			}
		});
	}
}

exports.getItemDetails = getItemDetails;


function checkout(req,res)
{
	var sql = 'SELECT totalOfCart('+req.user.user_id+') AS total;';
		connection.query(sql,function (error, rows, fields)
		{
			if(error) throw error;
			res.render('checkout.ejs',{
				user : req.user,
				total : rows[0].total
			});
		});
}

exports.checkout = checkout;


function PlaceOrder(req,res)
{
	var sql ='CALL checkout('+req.user.user_id + ',' + connection.escape(req.body.name) + ',' + connection.escape(req.body.address) + ',' + connection.escape(req.body.city) + ',' +connection.escape( req.body.country) +','+ connection.escape(req.body.zip) +','+ connection.escape(req.body.email) +','+ connection.escape(req.body.contact_no)+ ',@out_put);';
	connection.query(sql,function (error, rows, fields)
	{
		var sql = 'SELECT @out_put AS ret_val;';
		if(error) throw error;
		connection.query(sql,function (error, rows, fields)
		{
			if(error) throw error;
			if(rows[0].ret_val == 0)
			{
				res.send("<h4>You Don't Have Enough Balance to place this order.Plaese Update Your <a href = '/shoppingcart'>Cart</a> </h4>");
			}
			else if(rows[0].ret_val == -1)
			{
				res.send("<h4>You Can't order more then 50 units of one wine once.Plaese Update Your <a href = '/shoppingcart'>Cart</a> </h4>");
			}
			else if(rows[0].ret_val == -2)
			{
				res.send("<h4>You Don't have any item in your cart.Plaese Update Your <a href = '/shoppingcart'>Cart</a> </h4>");
			}
			else if(rows[0].ret_val != 786)
			{
				var sql = 'SELECT wine.wine_id,wine.name FROM wine WHERE wine_id ='+rows[0].ret_val;
				connection.query(sql,function (error, rows, fields)
				{
					if(error) throw error;
					res.send("<h4><a href='/productdetails?id="+rows[0].wine_id+" '> "+rows[0].name+" </a> is Out Of Stock for your required quantity.Plaese Update Your <a href = '/shoppingcart'>Cart</a> </h4>");
				});
			}
			else if(rows[0].ret_val == 786)
			{
				res.send("<h4>Checkout Successful. View your <a href='/orderhistory'>Order History</a></h4>");
			}
		});
	});
}
exports.PlaceOrder = PlaceOrder;

function locateWineries(req,res)
{
	var sql = 'SELECT * FROM location;';
	connection.query(sql,function (error, rows, fields)
	{
		if(error) throw error;
		res.render('locate.ejs',{
			user : req.user,
			winery : rows
			});
	});
}
exports.locateWineries = locateWineries;


function getWineries(req,res)
{
	var sql = 'SELECT * FROM winery WHERE zip='+req.query.zip;
	connection.query(sql,function (error, rows, fields)
	{
		if(error) throw error;
		if(rows.length == 0)
		{
			res.render('error.ejs',{
				user : req.user
			});
		}
		else
		{		
			res.render('getwineries.ejs',{
				user : req.user,
				winery : rows
			});
		}
	});
}
exports.getWineries = getWineries;

function getDirection(req,res)
{
	var sql = 'SELECT street,distric,state FROM winery INNER JOIN location ON winery.zip = location.zip';
	connection.query(sql,function (error, rows, fields)
	{
		if(error) throw error;
		if(rows.length == 0)
		{
			res.render('error.ejs',{
				user : req.user
			});
		}
		else
		{		
			res.render('getdirection.ejs',{
				user : req.user,
				winery : rows
			});
		}
	});
}
exports.getDirection =getDirection;

function getWineryinfo(req,res)
{
	var sql = 'SELECT * FROM winery WHERE zip='+req.query.zip;
	connection.query(sql,function (error, rows, fields)
	{
		if(error) throw error;
		if(rows.length == 0)
		{
			res.render('error.ejs',{
				user : req.user
			});
		}
		else
		{		
			res.render('getwineryinfo.ejs',{
				user : req.user,
				winery : rows
			});
		}
	});
}
exports.getWineryinfo = getWineryinfo;

function getComments(req,res)
{
	var sql = 'SELECT profile.fname AS user,comments.comment AS comment_text FROM comments INNER JOIN profile ON comments.user_id = profile.user_id WHERE wine_id ='+req.body.wine_id;
	connection.query(sql,function (error, rows, fields)
	{
		if(error) throw error;
		if(rows.length == 0)
		{
		res.send("<div id='load-comment'>No comments found.</div>");
		}
		else
		{		
			res.render('comments.ejs',{
				comments : rows
			});
		}
	});
}
exports.getComments = getComments;


function addComment(req,res)
{
	if(req.user)
	{
		var sql = "SELECT COUNT(*) AS count FROM comments WHERE user_id = "+req.user.user_id+" AND wine_id="+req.body.wine_id;
		connection.query(sql,function (error, rows, fields)
		{
			if(error) throw error;
			if(rows[0].count >=5)
			{
				res.send("You can't add more then 5 comments to an item.")
			}
			else
			{
		
				var sql = 'INSERT INTO comments VALUES('+req.user.user_id+','+req.body.wine_id+','+connection.escape(req.body.comment_text)+');';
				connection.query(sql,function (error, rows, fields)
				{
					if(error) throw error;
					var sql = 'SELECT fname FROM profile WHERE user_id='+req.user.user_id;
					connection.query(sql,function (error, rows, fields)
					{
						if(error) throw error;
							res.send("<span style='color:purple;font-size:12px'> "+rows[0].fname+"</span>&nbsp;&nbsp;&nbsp;"+req.body.comment_text+"<br/><div id='load-comment'></div>");
					});
				});
			}
		});
	}
	else
	{
		res.send("please <a href='/login'>login</a> to add comment.");
	}
}
exports.addComment = addComment;


function addToWishlist(req,res)
{
	if(req.user)
	{
		var sql = "INSERT INTO wishlist VALUES("+req.user.user_id+","+req.body.wine_id+");";
		connection.query(sql,function (error, rows, fields)
		{
			if(error) throw error;
				res.send("<h4><img src = 'images/green_good.png'/>Added to <a href = '/wishlist'>wishlist</a></h4>");
		});
	}
	else
	{
		res.send("please <a href='/login'>login</a> to add this item to <a href = '/wishlist'>wishlist</a>.");
	}
}
exports.addToWishlist = addToWishlist;
function rate(req,res)
{
	var sql='select *,count(*) from rate where user_id='+req.user.user_id+' and wine_id='+req.body.id+' group by wine_id,user_id having count(*)>0;';
	connection.query(sql,function(error,len,fields)
	{
		if(error) throw error;
		console.log(len.length);
		if(len.length==0)
		{
			var sql='set foreign_key_checks=0; insert into rate values('+req.user.user_id+','+req.body.id+','+req.body.rate+');';
			connection.query(sql,function(error,rows,fields)
			{
			if(error) throw error;
			});
			var sql = 'select rate,wine.wine_id,name,price from (select truncate(sum(sum)/sum(count),2) as rate,wine_id from (select (average*count) as sum,wine_id,count from (select avg((rate.rate)) as average ,wine.wine_id,count(*) as count from rate join wine on wine.wine_id=rate.wine_id group by rate.rate,rate.wine_id) as a) as b group by wine_id) as c right JOIN  wine on wine.wine_id=c.wine_id where wine.wine_id >= '+req.body.base+' limit 8;';
	connection.query(sql,function(error,rows,fields)
	{
		if(error) throw error;
		res.render('next.ejs', {
		user : req.user,
		items : rows
		});
	});

		}
		
	});
}
exports.rate=rate;
function prev(req,res)
{
	
	console.log(req.body.id);
	var var1=req.body.id;
	var var2=req.body.id-9;
	var sql = 'select rate,wine.wine_id,name,price from (select truncate(sum(sum)/sum(count),2) as rate,wine_id from (select (average*count) as sum,wine_id,count from (select avg((rate.rate)) as average ,wine.wine_id,count(*) as count from rate join wine on wine.wine_id=rate.wine_id group by rate.rate,rate.wine_id) as a) as b group by wine_id) as c right JOIN  wine on wine.wine_id=c.wine_id where wine.wine_id < '+var1+' and wine.wine_id > '+var2+';';
	connection.query(sql,function(error,rows,fields)
	{
		if(error) throw error;
		res.render('next.ejs', {
		user : req.user,
		items : rows
		});
	});
}
exports.prev=prev;
function next(req,res)
{
	
	console.log(req.body.id);
	var sql ='select rate,wine.wine_id,name,price from (select truncate(sum(sum)/sum(count),2) as rate,wine_id from (select (average*count) as sum,wine_id,count from (select avg((rate.rate)) as average ,wine.wine_id,count(*) as count from rate join wine on wine.wine_id=rate.wine_id group by rate.rate,rate.wine_id) as a) as b group by wine_id) as c right JOIN  wine on wine.wine_id=c.wine_id where wine.wine_id> '+req.body.id+ ' limit 8;';
	connection.query(sql,function(error,rows,fields)
	{
		if(error) throw error;
		res.render('next.ejs', {
		user : req.user,
		items : rows
		});
	});
}
exports.next=next;
function searchs(req,res)
{
	  var sql = 'SELECT * from wine where name like "%'+req.body.keyword+'%" limit 8;';
	  connection.query(sql,function(error,rows,fields)
	{
		if(error) throw error;
		res.render('products.ejs', {
		user : req.user,
		items : rows
		});
	});
}
exports.searchs = searchs;
function products(req,res)
{
	var sql = 'select rate,wine.wine_id,name,price from (select truncate(sum(sum)/sum(count),2) as rate,wine_id from (select (average*count) as sum,wine_id,count from (select avg((rate.rate)) as average ,wine.wine_id,count(*) as count from rate join wine on wine.wine_id=rate.wine_id group by rate.rate,rate.wine_id) as a) as b group by wine_id) as c right JOIN  wine on wine.wine_id=c.wine_id limit 8;';
	connection.query(sql,function(error,rows,fields)
	{
		if(error) throw error;
		res.render('products.ejs', {
		user : req.user,
		items : rows
		});
	});
}
exports.products = products;

