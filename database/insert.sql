USE wine;

SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO users (user_id,username,password,joined,balance,type,active)VALUES(1,"vinod","1",curdate(),100,'user',1);

INSERT INTO profile VALUES(1,'vinod','kumar','kumar003vinod@gmail.com','1993-08-08','+919459075086');

INSERT INTO wine VALUES(1,'signature','2013-12-12','Nothing',30,600,1,1);

INSERT INTO company VALUES(1,'signature');

INSERT INTO class VALUES(1,'wine');

INSERT INTO winery VALUES(1,'winery1','street address1','175005');

INSERT INTO location VALUES('175005','Mandi','Himachal Pradesh','India');

INSERT INTO available_at VALUES(1,1,30);

INSERT INTO comments VALUES(1,1,'This is really fucking good....');

INSERT INTO cart VALUES(1,1,1,3);

INSERT INTO stock VALUES(1,20);

