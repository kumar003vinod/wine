var mysql = require('mysql');

function NewDatabaseConnection()
{
	var new_connection = mysql.createConnection({
		user: "root",
		password: "vinod",
		database: "wine",
		multipleStatements: "True",
		dateStrings: "True"
	});

	new_connection.connect(function(err) {
		// connected! (unless `err` is set)
		if (!err)
		{
			//new_connection is successful
			//console.log('database connected');
		}
		else
		{
			console.log(err.code); // 'ECONNREFUSED'
			console.log(err.fatal); // true
		}
	});
	return new_connection;
}

exports.NewDatabaseConnection = NewDatabaseConnection;

