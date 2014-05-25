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

--
--	Function to calculate total quantity avaialble for wine at all wineries
--
DROP FUNCTION IF EXISTS TotalAvailableQuantityAtWineries;
CREATE FUNCTION TotalAvailableQuantityAtWineries(mywine_id BIGINT)
RETURNS INT
DETERMINISTIC
BEGIN
	DECLARE total BIGINT DEFAULT 0;
	SELECT SUM(quantity) INTO total FROM available_at WHERE wine_id = mywine_id;
	IF total IS NULL THEN
	RETURN(0);
	ELSE
	RETURN(total);
	END IF;
END //

--
--	Function to calculate total quantity avaialble for wine at stock
--
DROP FUNCTION IF EXISTS TotalAvailableQuantityAtStock;
CREATE FUNCTION TotalAvailableQuantityAtStock(mywine_id BIGINT)
RETURNS INT
DETERMINISTIC
BEGIN
	DECLARE total BIGINT DEFAULT 0;
	SELECT quantity INTO total FROM stock WHERE wine_id = mywine_id;
	IF total IS NULL THEN
	RETURN(0);
	ELSE
	RETURN(total);
	END IF;
END //


DROP FUNCTION IF EXISTS totalOfCart;
CREATE FUNCTION TotalOfCart(myuser_id BIGINT)
RETURNS INT
DETERMINISTIC
BEGIN
	DECLARE total INT DEFAULT 0;
	SELECT SUM(wine.price*cart.quantity) INTO total from cart inner join  wine on cart.wine_id = wine.wine_id WHERE user_id = myuser_id;
	IF total IS NULL THEN
		RETURN(0);
	ELSE
		RETURN(total);
	END IF;
END //




--
--	Function to place an order
--

DROP FUNCTION IF EXISTS PlaceOrder;
CREATE FUNCTION PlaceOrder(myuser_id BIGINT,myname VARCHAR(45),myaddress VARCHAR(100),mycity VARCHAR(45),mycountry VARCHAR(45),myzip VARCHAR(10),myemail VARCHAR(45),mycontact_no VARCHAR(20))
RETURNS INT
DETERMINISTIC
BEGIN
	DECLARE mytotal_amount BIGINT DEFAULT 0;
	DECLARE mybalance INT DEFAULT 0;
	DECLARE mycart_size INT DEFAULT 0;
	DECLARE req_id BIGINT DEFAULT 0;
	DECLARE req_wine_id BIGINT DEFAULT 0;
	DECLARE req_quantity INT DEFAULT 0;
	DECLARE avl_quantity INT DEFAULT 0;
	DECLARE order_id INT DEFAULT 0;	
	DECLARE done INT DEFAULT FALSE;
	DECLARE cart_cursor CURSOR FOR SELECT cart.id,cart.wine_id,cart.quantity FROM cart WHERE user_id = myuser_id;
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

	SELECT COUNT(*) INTO mycart_size FROM cart WHERE user_id = myuser_id;
	IF mycart_size = 0 THEN
		RETURN(-2);
	ELSE
		SELECT balance INTO mybalance FROM users WHERE user_id = myuser_id;
		SELECT TotalOfCart(myuser_id) AS total INTO mytotal_amount;
		IF mytotal_amount > mybalance THEN
			RETURN(0);
		ELSE
			SELECT COUNT(*)+1 AS order_id INTO order_id FROM orders;
			SET FOREIGN_KEY_CHECKS=0;
			OPEN cart_cursor;
			quantity_comfirmation_loop: LOOP
				FETCH cart_cursor INTO req_id,req_wine_id,req_quantity;
				IF done THEN
					LEAVE quantity_comfirmation_loop;
				END IF;
				IF req_quantity > 50 THEN
					RETURN(-1);
				END IF;
				SELECT TotalAvailableQuantityAtStock(req_wine_id) AS total INTO avl_quantity;
				IF req_quantity > avl_quantity THEN
					RETURN(req_wine_id);
				ELSE
					DELETE FROM cart WHERE id =	req_id;
					INSERT INTO ordered_items VALUES(order_id,req_wine_id,req_quantity);
					UPDATE stock SET quantity = avl_quantity - req_quantity WHERE wine_id = req_wine_id;
				END IF;
			END LOOP;
			INSERT INTO orders VALUES(order_id,NOW(),myuser_id,mytotal_amount,myname,myaddress,mycity,mycountry,myemail,mycontact_no,myzip);
			UPDATE users SET balance = mybalance - mytotal_amount WHERE user_id = myuser_id;
			CLOSE cart_cursor;
			RETURN(786);
		END IF;
	END IF;
END //


--
--	Procedure to checkout
--	It places order and if successfully processed all items
--	in cart it will commit otherwise it will rollback
--
DROP PROCEDURE IF EXISTS checkout;
CREATE PROCEDURE checkout(myuser_id BIGINT,myname VARCHAR(45),myaddress VARCHAR(100),mycity VARCHAR(45),mycountry VARCHAR(45),myzip VARCHAR(10),myemail VARCHAR(45),mycontact_no VARCHAR(20),OUT out_code INT)
DETERMINISTIC
BEGIN
	START TRANSACTION;
	DECLARE ret_val INT DEFAULT 0;
	SELECT PlaceOrder(1,'vinod','Prashar Hostel','Mandi','India','175001','kumar003vinod@gmail.com','+919459075086') INTO ret_val;
	IF ret_val = 786 THEN
		out_code = 786;
		COMMIT;
	ELSE
		out_code = 0;
		ROLLBACK;
	END IF;
END //


/*Trigger for creating profile when user on signup*/

DROP TRIGGER IF EXISTS profile_tig;

CREATE TRIGGER profile_tig
	AFTER INSERT ON users
	FOR EACH ROW
	BEGIN
		INSERT INTO profile VALUES(NEW.user_id,'fname','lname',NULL,NULL,NULL);
	END //


