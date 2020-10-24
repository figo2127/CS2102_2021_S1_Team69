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
	rating DOUBLE(1, 2);
	status BOOL
);

CREATE TABLE availability (
	start_date DATETIME(0) NOT NULL,
	end_date DATETIME(0) NOT NULL,
	carer_username VARCHAR(20) NOT NULL REFERENCES carers(username),
	indicate VARCHAR(20) NOT NULL REFERENCES carers(status),
	PRIMARY KEY(carer_username, start_date, end_date)
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
