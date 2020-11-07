CREATE DATABASE petcaringdb;

DROP TABLE IF EXISTS bids CASCADE;
DROP TABLE IF EXISTS takes_care CASCADE;
DROP TABLE IF EXISTS carers CASCADE;
DROP TABLE IF EXISTS credit_cards CASCADE;
DROP TABLE IF EXISTS owners CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS working_days CASCADE;
DROP TABLE IF EXISTS pets CASCADE;

CREATE TABLE accounts(
  username VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
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
  is_fulltime BOOL NOT NULL,
  PRIMARY KEY(carer_name)
);

CREATE TABLE takes_care (
  carer_name VARCHAR(20) NOT NULL REFERENCES carers(carer_name),
  category_name VARCHAR(20) NOT NULL REFERENCES categories(category_name),
  carer_price NUMERIC(5,2) NOT NULL ,
  PRIMARY KEY(carer_name, category_name)
);

CREATE TABLE working_days (
  working_date DATE NOT NULL,
  carer_name VARCHAR(20) NOT NULL REFERENCES carers(carer_name) ON DELETE Cascade,
  number_of_pets INT NOT NULL CHECK(number_of_pets >= 0 AND number_of_pets <= 5),
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
  is_successful BOOL NULL,
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
  PRIMARY KEY(start_date, end_date, carer_name, owner_name, pname),
  CHECK(start_date <= end_date AND bid_date <= payment_date AND review_date >= end_date),
  -- the check below prevents reviews when bid is not successful
  CHECK(is_successful OR (NOT is_successful AND review_rating IS NULL AND review_content IS NULL AND review_date IS NULL))
);