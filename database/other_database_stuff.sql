/*
This file contains all extra features added to database
like:- Stored procedures, triggers, views, transactions etc.
*/
USE wine;

DROP FUNCTION IF EXISTS AddUser;

DELIMITER //
CREATE FUNCTION AddUser(myusername VARCHAR(45), mypassword VARCHAR(45),mytype VARCHAR(15))
RETURNS INT
DETERMINISTIC
BEGIN
	DECLARE total_count INT DEFAULT 1;
	DECLARE my_user_id INT DEFAULT 1;
	SELECT COUNT(*) INTO total_count FROM users WHERE username = myusername;
	IF total_count > 0 THEN
	RETURN(0);
	ELSE
	INSERT INTO users(username,password,joined,type,active)VALUES(myusername,mypassword,NOW(),mytype,1);
	SELECT user_id INTO my_user_id FROM users WHERE username = myusername;
	RETURN(my_user_id);
	END IF;
END //


