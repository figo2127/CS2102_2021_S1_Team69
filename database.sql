CREATE DATABASE petcaringdb;

CREATE TABLE todo(
  todo_id SERIAL PRIMARY KEY,
  description VARCHAR(255)
);

CREATE TABLE accounts(
	username VARCHAR(20) NOT NULL,
	password VARCHAR(20) NOT NULL,
	name VARCHAR(30) NOT NULL,
	phone VARCHAR(20) NOT NULL,
	area VARCHAR(5),
	address VARCHAR(80),
	PRIMARY KEY(username)
);

CREATE TABLE admin(
	account_userName VARCHAR(20) NOT NULL REFERENCES accounts(username),
	PRIMARY KEY(account_username)
);

CREATE TABLE categories (
	category_name VARCHAR(20) PRIMARY KEY,
	base_price NUMERIC(5,2) NOT NULL
);

CREATE TABLE pets (
	pname VARCHAR(20) NOT NULL,
	owner_username VARCHAR(20) NOT NULL REFERENCES owners(username),
	requirements TEXT,
	belongs VARCHAR(20) NOT NULL REFERENCES categories(category_name),
	PRIMARY KEY(pname, owner_username)
);

CREATE TABLE carers (
	number_pets INT,
	rating DOUBLE(1, 2),
	isFullTime BOOL
);

CREATE TABLE availability (
	available_date DATETIME(0) NOT NULL,
	carer_username VARCHAR(20) NOT NULL REFERENCES carers(username),
	PRIMARY KEY(available_date, carer_username)
	-- ON DELETE CASCAdssasasa
);

CREATE TABLE availability_bid (
	available_date DATETIME(0) NOT NULL,
	carer_username VARCHAR(20) NOT NULL REFERENCES carers(username),
    owner_username VARCHAR(20) NOT NULL REFERENCES owners(username),
    pname VARCHAR(20) NOT NULL REFERENCES pet(pname),
	PRIMARY KEY(available_date, carer_username)
);

-- bids table
CREATE TABLE bids(
  carer_username VARCHAR(20) NOT NULL REFERENCES carers(username),
  owner_username VARCHAR(20) NOT NULL REFERENCES owners(username),
  pname VARCHAR(20) NOT NULL REFERENCES pet(pname),
  bid_date DATE NOT NULL,
  price NUMBER NOT NULL,
  is_sucessful INTEGER NULL,
  credit_card_num VARCHAR(16),
  payment_date DATE NOT NULL,,∂
  payment_mode VARCHAR(50) NOT NULL,
  delivery_method VARCHAR(50) NOT NULL,
  review_rating INTEGER NULL,
  review_content VARCHAR(500) NULL,
  review_date DATE NOT NULL,
  PRIMARY KEY(carer_username, owner_username, pname)
);

INSERT INTO accounts VALUES 
('gycc', '123456', 'Guo Yichao', '86561895', 'West', 'Temasek Hall, 12 Kent Ridge Drive'),
('dearvae', '123456', 'Li Beining', '83940829', 'North', '26 Clementi Road'),
('adi', '123456', 'Adi Yoga', '98394292', 'West', '35 Clementi Road'),
('zz', '123456', 'Zheng Zhi', '92839040', 'North', '23 Bedok Central'),
('figo', '123456', 'Lee Ze Xin', '82038401', 'South', 'PGP'),
('jy', '123456', 'Jiaying', '91084982', 'South', 'PGP');

INSERT INTO admin VALUES
('adi'),
('zz');

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