CREATE DATABASE petcaringdb;


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
	account_userName VARCHAR(20) NOT NULL REFERENCES accounts(username),
	PRIMARY KEY(account_username)
);

CREATE TABLE owners(
    owner_userName VARCHAR(20) NOT NULL REFERENCES accounts(username) ON DELETE Cascade,
	PRIMARY KEY(owner_userName)
);

CREATE TABLE categories (
	category_name VARCHAR(20) PRIMARY KEY,
	base_price NUMERIC(5,2) NOT NULL
);

CREATE TABLE pets (
	pname VARCHAR(20) NOT NULL,
	owner_username VARCHAR(20) NOT NULL REFERENCES owners(owner_userName) ON DELETE CASCADE,
	requirements TEXT,
	belongs VARCHAR(20) NOT NULL REFERENCES categories(category_name),
	PRIMARY KEY(pname, owner_username)
);

CREATE TABLE credit_card(
    owner_userName VARCHAR(20) REFERENCES owners(owner_userName) ON DELETE Cascade,
    credit_card_num VARCHAR(16) NOT NULL,
    cvv INTEGER NOT NULL,
    expiry_date DATE NOT NULL,
    PRIMARY KEY(owner_userName, credit_card_num)

);

CREATE TABLE carers (
	username VARCHAR(20) NOT NULL REFERENCES accounts(username),
	category VARCHAR(20) NOT NULL REFERENCES categories(category_name),
	number_pets INT,
	rating NUMERIC(3, 2),
	isFullTime BOOL,
	PRIMARY KEY(username)
);

CREATE TABLE availability (
	available_date timestamp(0) NOT NULL,
	carer_username VARCHAR(20) NOT NULL REFERENCES carers(username),
	PRIMARY KEY(available_date, carer_username)
	-- ON DELETE CASCAdssasasa
);

CREATE TABLE availability_bid (
	available_date timestamp(0) NOT NULL,
	carer_username VARCHAR(20) NOT NULL REFERENCES carers(username),
    owner_username VARCHAR(20) NOT NULL,
    pname VARCHAR(20) NOT NULL,
    FOREIGN KEY (owner_username, pname) REFERENCES pets(owner_userName, pname),
	PRIMARY KEY(available_date, carer_username)
);

-- bids table
CREATE TABLE bids(
  carer_username VARCHAR(20) NOT NULL REFERENCES carers(username),
  owner_username VARCHAR(20) NOT NULL REFERENCES owners(owner_userName),
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
  PRIMARY KEY(carer_username, owner_username, pname),
  FOREIGN KEY (owner_username, pname) REFERENCES pets(owner_userName, pname)
);

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
('adi'),
('jy'),
('dearvae'),
('gycc'),
('figo'),
('zz');

INSERT INTO credit_card VALUES
('adi', '1234567893331111', 111, '2030-01-02'),
('jy', '1234578904441111', 222, '2020-11-11'),
('dearvae', '2453738493331111', 333, '2022-01-01'),
('gycc','4357876544441111', 444, '2023-01-04'),
('figo', '6472345162111111', 555, '2025-02-02'),
('zz','2648293625161111', 666, '2020-12-12');

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