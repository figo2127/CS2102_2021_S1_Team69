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

INSERT INTO accounts VALUES 
('gycc', '123456', 'Guo Yichao', '86561895', 'West', 'Temasek Hall, 12 Kent Ridge Drive'),
('dearvae', '123456', 'Li Beining', '83940829', 'North', '26 Clementi Road'),
('adi', '123456', 'Adi Yoga', '98394292', 'West', '35 Clementi Road'),
('zz', '123456', 'Zheng Zhi', '92839040', 'North', '23 Bedok Central'),
('figo', '123456', 'Li Zexin', '82038401', 'South', 'PGP'),
('jy', '123456', 'Jiaying', '91084982', 'South', 'PGP');

INSERT INTO admin VALUES
('adi'),
('zz');