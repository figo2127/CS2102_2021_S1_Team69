
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
	carer_price NUMERIC(5,2) NOT NULL ,
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
('kuaikuai', 'dearvae', 'go for a walk everyday', 'Cat'),
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
('2020-10-05', 'gycc', 0);

INSERT INTO takes_care VALUES
('zz', 'Cat', 50.00),
('zz', 'Dog', 50.00),
('gycc', 'Cat', 50.00);


INSERT INTO bids VALUES 
('2020-10-04', '2020-10-08', 'zz', 'dearvae', 'kuaikuai', '2020-09-20', 55.5, 'true', null, '2020-09-21', 'cash', 'pick up', 4, 'very good', '2020-10-09'),
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
SELECT carer_name
FROM takes_care
WHERE category_name = 'Dog';

-- 2. get list of carer, show their ($x) category price (sort)	jiaying
SELECT carers.username, categories.base_price,
CASE WHEN categories.base_price > 4 THEN categories.base_price * 1.2
	 WHEN categories.base_price > 3 THEN categories.base_price * 1.1
	 ELSE categories.base_price
	 END AS price
FROM carers, categories
WHERE carers.category = categories.category_name
ORDER BY categories.base_price;
-- 3. rank owner money spend per month beining
SELECT owner_name, SUM((end_date - start_date)*daily_price) AS money_spend
      FROM bids WHERE is_sucessful = True 
      AND EXTRACT(MONTH FROM bid_date) = 9
      AND EXTRACT(YEAR FROM bid_date) = 2020
      GROUP BY owner_name
      ORDER BY money_spend DESC;
-- 4. get all review for a carer sort by date			figo
SELECT review_date, review_content, review_rating
FROM bids
WHERE carer_name = 'homie' AND review_date NOT NULL
ORDER BY review_date DESC
-- 5. get all review for a carer sort by review_rating	figo
SELECT review_date, review_content, review_rating
FROM bids
WHERE carer_name = 'homie' AND review_rating NOT NULL
ORDER BY review_rating DESC
-- 6. get all review given by a owner sort by date beining
SELECT review_rating, review_content, review_date 
    FROM bids WHERE owner_name = 'dearvae' 
	 AND review_rating IS NOT NULL
    ORDER BY review_date DESC
-- 7. get number of petday for all carer in ($x) month yichao
-- 8. get number of petday by carer_name in ($x) month yichao
-- 9. total number of pets taken care of in ($x) month zhengzhi
SELECT COUNT(*)
FROM bids
WHERE
  EXTRACT(MONTH FROM start_date) = $1 AND
  carer_name = $2;
-- 10. get monthly salary by carer name for ($x) month zhengzhi
SELECT (SUM (b.daily_price) OVER ()) * $1 + $2 AS salary
FROM (
    SELECT generate_series(
      $3,
      (DATE($3) + INTERVAL '1 month' - INTERVAL '1 day')::DATE,
      '1 day'::interval
    )::date AS day
) days_in_month
CROSS JOIN bids b
WHERE
  b.start_date <= day AND b.end_date >= day AND
  b.carer_name = $4
ORDER BY
  day ASC,
  daily_price ASC
OFFSET $5;

research, securely call api with login account


-- CREATE TABLE working_days (
--  working_date DATE NOT NULL,
--  carer_name VARCHAR(20) NOT NULL REFERENCES carers(carer_name) ON DELETE Cascade,
--  number_of_pets INT,
--  PRIMARY KEY(working_date, carer_name)
-- );

-- Trigger bid_turns_success will call function increment_working_day_pet.
-- This is one off
-- Any update on is_successful column of bids table will cause the trigger (including setting is_successful from true to false and vice versa)
-- so needs to modify further if we want to allow rollback of a successful bid
CREATE OR REPLACE FUNCTION increment_working_day_pet()
RETURNS TRIGGER AS 
$$
BEGIN
UPDATE working_days
SET number_of_pets = number_of_pets + 1
WHERE carer_name = NEW.carer_name
AND working_date >= NEW.start_date
AND working_date <= NEW.end_date;
RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER bid_turns_success
AFTER UPDATE OF is_successful ON bids
FOR EACH ROW EXECUTE PROCEDURE increment_working_day_pet();

-- Function and trigger to ensure that carer_price in takes_care table will not be lower than the base price
CREATE OR REPLACE FUNCTION base_price_check()
RETURNS TRIGGER AS 
$$
BEGIN
IF
  NEW.carer_price < (SELECT base_price FROM categories c WHERE c.category_name = NEW.category_name)
THEN
  RAISE EXCEPTION 'Carer price cannot be lower than base price.';
END IF;
RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER base_price_check_trigger
BEFORE UPDATE OR INSERT ON takes_care
FOR ROW EXECUTE PROCEDURE base_price_check();

-- Function and trigger to update carer_price in takes_care table when there is a new review rating
CREATE OR REPLACE FUNCTION update_carer_price()
RETURNS TRIGGER AS 
$$
DECLARE bid_pet_category VARCHAR;
DECLARE category_base_price NUMERIC;
DECLARE avg_rating NUMERIC;

BEGIN

SELECT belongs INTO bid_pet_category
FROM pets p
WHERE
  p.pname = NEW.pname AND
  p.owner_name = NEW.owner_name;

SELECT base_price INTO category_base_price
FROM categories c
WHERE c.category_name = bid_pet_category;

SELECT AVG(review_rating) INTO avg_rating
FROM bids b
WHERE
  b.carer_name = NEW.carer_name AND
  b.review_rating IS NOT NULL AND
  (SELECT belongs
  FROM pets p
  WHERE
    p.pname = b.pname AND
    p.owner_name = b.owner_name
  ) = bid_pet_category;

-- NULL check
IF
  avg_rating IS NULL
THEN
  SELECT 0.0 + NEW.review_rating INTO avg_rating;
END IF;


IF
  NEW.review_rating IS NOT NULL
THEN
  UPDATE takes_care t
  SET carer_price = category_base_price * (1.00 + avg_rating / 10.00)
  WHERE
    t.carer_name = NEW.carer_name AND
    t.category_name = bid_pet_category;
END IF;
RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER update_carer_price_trigger
BEFORE UPDATE OR INSERT ON bids
FOR ROW EXECUTE PROCEDURE update_carer_price();
