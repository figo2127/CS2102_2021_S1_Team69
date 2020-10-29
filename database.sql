<<<<<<< HEAD

CREATE DATABASE petcaringdb;

DROP TABLE IF EXISTS carers;
DROP TABLE IF EXISTS owners;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS bids;
DROP TABLE IF EXISTS working_days;
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS credit_cards;
DROP TABLE IF EXISTS takes_care;


CREATE TABLE accounts(
 username VARCHAR(20) NOT NULL,
 password VARCHAR(20) NOT NULL,
 name VARCHAR(30) NOT NULL,
 phone VARCHAR(20) NOT NULL,
 area VARCHAR(5),
 address VARCHAR(80),
 PRIMARY KEY(username)
);

CREATE TABLE admins(
 admin_name VARCHAR(20) NOT NULL REFERENCES accounts(username),
 PRIMARY KEY(admin_name)
);

CREATE TABLE owners(
	owner_name VARCHAR(20) NOT NULL REFERENCES accounts(username) ON DELETE Cascade,
 PRIMARY KEY(owner_name)
);

CREATE TABLE categories (
 category_name VARCHAR(20) PRIMARY KEY,
 base_price NUMERIC(5,2) NOT NULL
);

CREATE TABLE pets(
 pname VARCHAR(20) NOT NULL,
 owner_name VARCHAR(20) NOT NULL REFERENCES owners(owner_name) ON DELETE CASCADE,
 requirements TEXT,
 belongs VARCHAR(20) NOT NULL REFERENCES categories(category_name),
 PRIMARY KEY(pname, owner_name)
);

CREATE TABLE credit_cards(
    owner_name VARCHAR(20) REFERENCES owners(owner_name) ON DELETE Cascade,
    credit_card_num VARCHAR(16) NOT NULL,
    cvv INTEGER NOT NULL,
    expiry_date DATE NOT NULL,
    PRIMARY KEY(owner_name, credit_card_num)
);

CREATE TABLE carers(
 carer_name VARCHAR(20) NOT NULL REFERENCES accounts(username),
 rating NUMERIC(3, 2),
 isFullTime BOOL NOT NULL,
 PRIMARY KEY(carer_name)
);

CREATE TABLE takes_care (
	carer_name VARCHAR(20) NOT NULL REFERENCES carers(carer_name),
	category_name VARCHAR(20) NOT NULL REFERENCES categories(category_name),
	PRIMARY KEY(carer_name, category_name)
);

CREATE TABLE working_days (
 working_date DATE NOT NULL,
 carer_name VARCHAR(20) NOT NULL REFERENCES carers(carer_name) ON DELETE Cascade,
 number_of_pets INT,
 PRIMARY KEY(working_date, carer_name)
);

-- bids table
CREATE TABLE bids(
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  carer_name VARCHAR(20) NOT NULL,
  owner_name VARCHAR(20) NOT NULL,
  pname VARCHAR(20) NOT NULL,
  bid_date DATE NOT NULL,
  daily_price NUMERIC NOT NULL,
  is_sucessful BOOL NULL,
  credit_card_num VARCHAR(16),
  payment_date DATE NOT NULL,
  payment_mode VARCHAR(50) NOT NULL,
  delivery_method VARCHAR(50) NOT NULL,
  review_rating INTEGER NULL,
  review_content VARCHAR(500) NULL,
  review_date DATE NULL,
  FOREIGN KEY (start_date, carer_name) REFERENCES working_days(working_date, carer_name ) ON DELETE Cascade,
  FOREIGN KEY (end_date, carer_name) REFERENCES working_days(working_date, carer_name ) ON DELETE Cascade,
  FOREIGN KEY (pname, owner_name) REFERENCES pets(pname, owner_name),
  PRIMARY KEY(start_date, end_date, carer_name, owner_name, pname)
);

-- CREATE TABLE availability_bid (

--  owner_name VARCHAR(20) NOT NULL,
--  pname VARCHAR(20) NOT NULL,
--  FOREIGN KEY (owner_name, pname) REFERENCES pets(owner_name, pname),
--  PRIMARY KEY(available_date, carer_name)
-- );

INSERT INTO accounts VALUES 
('gycc', '123456', 'Guo Yichao', '86561895', 'West', 'Temasek Hall, 12 Kent Ridge Drive'),
('dearvae', '123456', 'Li Beining', '83940829', 'North', '26 Clementi Road'),
('adi', '123456', 'Adi Yoga', '98394292', 'West', '35 Clementi Road'),
('zz', '123456', 'Zheng Zhi', '92839040', 'North', '23 Bedok Central'),
('figo', '123456', 'Lee Ze Xin', '82038401', 'South', 'PGP'),
('jy', '123456', 'Jiaying', '91084982', 'South', 'PGP');

INSERT INTO admins VALUES
('adi'),
('zz');

INSERT INTO owners VALUES
('dearvae'),
('gycc'),
('jy');

INSERT INTO carers VALUES
('zz', null, 'true'),
('gycc', null, 'true');

INSERT INTO categories VALUES
('Bird', 40.00),
('Cat', 50.00),
('Chinchilla', 40.00),
('Dog', 50.00),
('Fish', 35.00),
('Frog', 35.00),
('Guinea Pig', 45.00),
('Hamster', 30.00),
('Mouse', 30.00),
('Pig', 50.00),
('Rabbit', 40.00),
('Rat', 30.00),
('Snake', 80.00),
('Spider', 75.00),
('Turtle', 30.00),
('Tortoise', 30.00);

INSERT INTO credit_cards VALUES
('dearvae', '2453738493331111', 333, '2022-01-01'),
('dearvae', '2453738493331112', 333, '2022-01-01'),
('gycc','4357876544441111', 444, '2023-01-04');

INSERT INTO pets VALUES 
('doggo', 'dearvae', 'go for a walk everyday', 'Dog'),
('manman', 'dearvae', 'feed twice a day', 'Cat'),
('kitty', 'gycc', 'allergic to fish', 'Cat'),
('meow', 'jy', 'NA', 'Cat');

INSERT INTO working_days VALUES
('2020-10-04', 'zz', 0),
('2020-10-05', 'zz', 0),
('2020-10-06', 'zz', 0),
('2020-10-07', 'zz', 0),
('2020-10-08', 'zz', 0),
('2020-10-09', 'zz', 0),
('2020-10-10', 'zz', 0),
('2020-10-04', 'gycc', 0),
('2020-10-05','gycc', 0);


INSERT INTO bids VALUES 
('2020-10-04', '2020-10-08', 'zz', 'dearvae', 'doggo', '2020-09-20', 55.5, 'true', null, '2020-09-21', 'cash', 'pick up', null, null, null),
('2020-10-04', '2020-10-08', 'zz', 'dearvae', 'manman', '2020-09-20', 55.5, 'true', null, '2020-09-21', 'cash', 'pick up', null, null, null),
('2020-10-04', '2020-10-05', 'gycc', 'jy', 'meow', '2020-09-20', 55.5, 'true', null, '2020-09-21', 'cash', 'pick up', null, null, null),
('2020-10-04', '2020-10-05', 'zz', 'gycc', 'kitty', '2020-09-20', 55.5, 'true', null, '2020-09-21', 'cash', 'pick up', null, null, null);


-- api needed:
-- account: (yichao)
-- 1.createAccount: username,password,types["carer","owner"],(and all otehr fieds)
-- 2.login: username, password 	return:success? types[]

-- Owner:
-- 3.4.5.6.CRUD for pet (jiaying)
-- 7.getOnwerInfo (with credit card info) (yi chao)
-- 8.updateUserIndo (yi chao)
-- 9,10,11,12.CRUD creditCard (Zheng zhi)

-- Carer:
-- 13.getListOfCarer (Figo)
-- 14.getCarerBy username(rating, category) (Figo)
-- getReviews by carername


-- Admin:
-- 15,16,17,18.CRUD category (Beining)

-- summary information
-- 4. Support the browsing of summary information for PCS Administrator. For instance, it can be
-- one of the following:
-- (a) Total number of Pet taken care of in the month.
-- (b) Total salary to be paid to all Care Taker for the given month.
-- (c) The month with the highest number of jobs.
-- (d) The underperforming1
-- full-time Care Taker.
-- (e) etc.

-- Bids:
-- createBids
-- getBids
-- getlist of sucess Bids by ownername (for onwer see past order)
-- getlist of sucess Bids by carername (for carer see past order)

-- addReviewForBids


-- 2. Support data access for the different users (e.g., Pet Owner can view reviews of Care Taker,
-- their own past orders, etc.; Care Taker can see their review, their past jobs, their salary, etc.).
-- 3. Support the browsing/searching of Care Taker by Pet Owner.

-- 5. Support the browsing of summary information for Care Taker. For instance, it can be one of
-- the following:
-- 1You may give your definition.
-- 2
-- (a) Total number of pet-day this month.
-- (b) Their expected salary for this month.
-- (c) etc.
-- 6. Support the browsing of summary information for Pet Owner. For instance, it can be one of
-- the following:
-- (a) All Care Taker in their area (if information is available).
-- (b) Other Pet Owner nearby.
-- (c) Their Pet information.
-- (d) etc.

-- 1. filter carer by pet category jiaying
-- 2. get list of carer, show their ($x) category price (sort)	jiaying
-- 3. rank owner money spend per month beining
-- 4. get all review for a carer sort by date			figo
-- 5. get all review for a carer sort by review_rating	figo
-- 6. get all review given by a owner sort by date beining
-- 7. get number of petday for all carer in ($x) month yichao
-- 8. get number of petday by carer_name in ($x) month yichao
-- 9. total number of pets taken care of in ($x) month zhengzhi
-- 10. get monthly salary by carer name for ($x) month zhengzhi
=======

CREATE DATABASE petcaringdb;

DROP TABLE IF EXISTS carers;
DROP TABLE IF EXISTS owners;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS credit_cards;
DROP TABLE IF EXISTS takes_care;

CREATE TABLE accounts(
 username VARCHAR(20) NOT NULL,
 password VARCHAR(20) NOT NULL,
 name VARCHAR(30) NOT NULL,
 phone VARCHAR(20) NOT NULL,
 area VARCHAR(5),
 address VARCHAR(80),
 PRIMARY KEY(username)
);

CREATE TABLE admins(
 admin_name VARCHAR(20) NOT NULL REFERENCES accounts(username),
 PRIMARY KEY(admin_name)
);

CREATE TABLE owners(
	owner_name VARCHAR(20) NOT NULL REFERENCES accounts(username) ON DELETE Cascade,
 PRIMARY KEY(owner_name)
);

CREATE TABLE categories (
 category_name VARCHAR(20) PRIMARY KEY,
 base_price NUMERIC(5,2) NOT NULL
);

CREATE TABLE pets(
 pname VARCHAR(20) NOT NULL,
 owner_name VARCHAR(20) NOT NULL REFERENCES owners(owner_name) ON DELETE CASCADE,
 requirements TEXT,
 belongs VARCHAR(20) NOT NULL REFERENCES categories(category_name),
 PRIMARY KEY(pname, owner_name)
);

CREATE TABLE credit_cards(
    owner_name VARCHAR(20) REFERENCES owners(owner_name) ON DELETE Cascade,
    credit_card_num VARCHAR(16) NOT NULL,
    cvv INTEGER NOT NULL,
    expiry_date DATE NOT NULL,
    PRIMARY KEY(owner_name, credit_card_num)
);

CREATE TABLE carers(
 carer_name VARCHAR(20) NOT NULL REFERENCES accounts(username),
 number_pets INT,
 rating NUMERIC(3, 2),
 isFullTime BOOL,
 PRIMARY KEY(carer_name)
);

CREATE TABLE takes_care (
	carer_name VARCHAR(20) NOT NULL REFERENCES carers(carer_name),
	category_name VARCHAR(20) NOT NULL REFERENCES categories(category_name),
	PRIMARY KEY(carer_name, category_name)
);

CREATE TABLE working_days (
 working_date DATE NOT NULL,
 carer_name VARCHAR(20) NOT NULL REFERENCES carers(carer_name) ON DELETE Cascade,
 number_of_pets INT,
 PRIMARY KEY(working_date, carer_name)
);

-- bids table
CREATE TABLE bids(
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  carer_name VARCHAR(20) NOT NULL,
  owner_name VARCHAR(20) NOT NULL,
  pname VARCHAR(20) NOT NULL,
  bid_date DATE NOT NULL,
  price NUMERIC NOT NULL,
  is_sucessful INTEGER NULL,
  credit_card_num VARCHAR(16),
  payment_date DATE NOT NULL,
  payment_mode VARCHAR(50) NOT NULL,
  delivery_method VARCHAR(50) NOT NULL,
  review_rating INTEGER NULL,
  review_content VARCHAR(500) NULL,
  review_date DATE NOT NULL,
  FOREIGN KEY (start_date, carer_name) REFERENCES working_days(working_date, carer_name ) ON DELETE Cascade,
  FOREIGN KEY (end_date, carer_name) REFERENCES working_days(working_date, carer_name ) ON DELETE Cascade,
  FOREIGN KEY (pname, owner_name) REFERENCES pets(pname, owner_name),
  PRIMARY KEY(start_date, end_date, carer_name, owner_name, pname)
);

INSERT INTO bids VALUES (

)

-- CREATE TABLE availability_bid (

--  owner_name VARCHAR(20) NOT NULL,
--  pname VARCHAR(20) NOT NULL,
--  FOREIGN KEY (owner_name, pname) REFERENCES pets(owner_name, pname),
--  PRIMARY KEY(available_date, carer_name)
-- );

INSERT INTO accounts VALUES 
('gycc', '123456', 'Guo Yichao', '86561895', 'West', 'Temasek Hall, 12 Kent Ridge Drive'),
('dearvae', '123456', 'Li Beining', '83940829', 'North', '26 Clementi Road'),
('adi', '123456', 'Adi Yoga', '98394292', 'West', '35 Clementi Road'),
('zz', '123456', 'Zheng Zhi', '92839040', 'North', '23 Bedok Central'),
('figo', '123456', 'Lee Ze Xin', '82038401', 'South', 'PGP'),
('jy', '123456', 'Jiaying', '91084982', 'South', 'PGP');

INSERT INTO admins VALUES
('adi'),
('zz');

INSERT INTO owners VALUES
('dearvae'),
('gycc');

INSERT INTO carers VALUES
('zz'),
('gycc');

INSERT INTO categories VALUES
('Bird', 40.00),
('Cat', 50.00),
('Chinchilla', 40.00),
('Dog', 50.00),
('Fish', 35.00),
('Frog', 35.00),
('Guinea Pig', 45.00),
('Hamster', 30.00),
('Mouse', 30.00),
('Pig', 50.00),
('Rabbit', 40.00),
('Rat', 30.00),
('Snake', 80.00),
('Spider', 75.00),
('Turtle', 30.00),
('Tortoise', 30.00);

INSERT INTO credit_cards VALUES
('dearvae', '2453738493331111', 333, '2022-01-01'),
('dearvae', '2453738493331112', 333, '2022-01-01'),
('gycc','4357876544441111', 444, '2023-01-04');

INSERT INTO pets VALUES 
('doggo', 'dearvae', 'go for a walk everyday', 'Dog'),
('kitty', 'gycc', 'allergic to fish', 'Cat');

INSERT INTO working_days VALUES
('2020-10-04', 'zz', 0),
('2020-10-05', 'zz', 0),
('2020-10-06', 'zz', 0),
('2020-10-07', 'zz', 0),
('2020-10-08', 'zz', 0),
('2020-10-09', 'zz', 0),
('2020-10-10', 'zz', 0),
('2020-10-04', 'gycc', 0),
('2020-10-05','gycc', 0);

-- api needed:
-- account: (yichao)
-- 1.createAccount: username,password,types["carer","owner"],(and all otehr fieds)
-- 2.login: username, password 	return:success? types[]

-- Owner:
-- 3.4.5.6.CRUD for pet (jiaying)
-- 7.getOnwerInfo (with credit card info) (yi chao)
-- 8.updateUserIndo (yi chao)
-- 9,10,11,12.CRUD creditCard (Zheng zhi)

-- Carer:
-- 13.getListOfCarer (Figo)
-- 14.getCarerBy username(rating, category) (Figo)
-- getReviews by carername


-- Admin:
-- 15,16,17,18.CRUD category (Beining)

-- summary information
-- 4. Support the browsing of summary information for PCS Administrator. For instance, it can be
-- one of the following:
-- (a) Total number of Pet taken care of in the month.
-- (b) Total salary to be paid to all Care Taker for the given month.
-- (c) The month with the highest number of jobs.
-- (d) The underperforming1
-- full-time Care Taker.
-- (e) etc.

-- Bids:
-- createBids
-- getBids
-- getlist of sucess Bids by ownername (for onwer see past order)
-- getlist of sucess Bids by carername (for carer see past order)

-- addReviewForBids


-- 2. Support data access for the different users (e.g., Pet Owner can view reviews of Care Taker,
-- their own past orders, etc.; Care Taker can see their review, their past jobs, their salary, etc.).
-- 3. Support the browsing/searching of Care Taker by Pet Owner.

-- 5. Support the browsing of summary information for Care Taker. For instance, it can be one of
-- the following:
-- 1You may give your definition.
-- 2
-- (a) Total number of pet-day this month.
-- (b) Their expected salary for this month.
-- (c) etc.
-- 6. Support the browsing of summary information for Pet Owner. For instance, it can be one of
-- the following:
-- (a) All Care Taker in their area (if information is available).
-- (b) Other Pet Owner nearby.
-- (c) Their Pet information.
-- (d) etc.

-- 1. filter carer by pet category jiaying
-- 2. get list of carer, show their ($x) category price (sort)	jiaying
-- 3. rank owner money spend per month beining
-- 4. get all review for a carer sort by date			figo
-- 5. get all review for a carer sort by review_rating	figo
-- 6. get all review given by a owner sort by date beining
-- 7. get number of petday for all carer in ($x) month yichao
-- 8. get number of petday by carer_name in ($x) month yichao
-- 9. total number of pets taken care of in ($x) month zhengzhi
-- 10. get monthly salary by carer name for ($x) month zhengzhi
>>>>>>> 64436760f057e428ed16e866e7675493b8e9b6e8
research, securely call api with login account