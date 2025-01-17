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
('2020-09-17', 'zz', 0),
('2020-09-18', 'zz', 0),
('2020-09-19', 'zz', 0),
('2020-09-20', 'zz', 0),
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
('2020-09-17', '2020-09-20', 'zz', 'dearvae', 'manman', '2020-08-20', 55.5, 'false', null, '2020-08-21', 'cash', 'pick up', null, null, null),
('2020-10-04', '2020-10-08', 'zz', 'dearvae', 'kuaikuai', '2020-09-20', 55.5, 'false', null, '2020-09-21', 'cash', 'pick up', null, null, null),
('2020-10-04', '2020-10-08', 'zz', 'dearvae', 'doggo', '2020-09-20', 55.5, 'false', null, '2020-09-21', 'cash', 'pick up', null, null, null),
('2020-10-04', '2020-10-08', 'zz', 'dearvae', 'manman', '2020-09-20', 55.5, 'false', null, '2020-09-21', 'cash', 'pick up', null, null, null),
('2020-10-04', '2020-10-05', 'gycc', 'jy', 'meow', '2020-09-20', 55.5, 'false', null, '2020-09-21', 'cash', 'pick up', null, null, null),
('2020-10-04', '2020-10-05', 'zz', 'gycc', 'kitty', '2020-09-20', 55.5, 'false', null, '2020-09-21', 'cash', 'pick up', null, null, null);

UPDATE bids SET review_rating = 4, review_date = '2020-10-09', review_content = 'very good'
WHERE start_date = '2020-10-04' AND end_date = '2020-10-08' AND carer_name = 'zz' AND owner_name = 'dearvae' AND pname = 'manman';

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
-- (d) The underperforming full-time Care Taker.
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
DECLARE carer_limit INTEGER;

BEGIN

IF
  (SELECT (is_fulltime OR rating >= 4.00) FROM carers WHERE carers.carer_name = NEW.carer_name)
THEN
  SELECT 5 INTO carer_limit;
ELSE
  SELECT 2 INTO carer_limit;
END IF;

IF
  (SELECT MAX(number_of_pets)
  FROM working_days
  WHERE carer_name = NEW.carer_name
  AND working_date >= NEW.start_date
  AND working_date <= NEW.end_date) >= carer_limit
THEN
  RAISE EXCEPTION 'Carer will exceed the pet days limit!';
END IF;

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
FOR ROW EXECUTE PROCEDURE increment_working_day_pet();

-- Function and trigger to ensure that carer_price in takes_care table will not be lower than the base price --
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
------------------------------------------------ END ----------------------------------------------------------

-- Function and trigger to update carer_price in takes_care table when there is a new review rating also updates carer's review --
CREATE OR REPLACE FUNCTION update_carer_price()
RETURNS TRIGGER AS 
$$
DECLARE bid_pet_category VARCHAR;
DECLARE category_base_price NUMERIC;
DECLARE category_avg_rating NUMERIC;

BEGIN

SELECT belongs INTO bid_pet_category
FROM pets p
WHERE
  p.pname = NEW.pname AND
  p.owner_name = NEW.owner_name;

SELECT base_price INTO category_base_price
FROM categories c
WHERE c.category_name = bid_pet_category;

SELECT (SUM(review_rating) + NEW.review_rating + 0.0) / (COUNT(*) + 1) INTO category_avg_rating
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

UPDATE carers SET rating = (
  SELECT (CASE
    WHEN COUNT(*) = 0 THEN NEW.review_rating
    ELSE (SUM(review_rating) + NEW.review_rating + 0.0) / (COUNT(*) + 1)
  END)
  FROM bids b
  WHERE
    b.carer_name = NEW.carer_name AND
    b.review_rating IS NOT NULL
)
WHERE carers.carer_name = NEW.carer_name;

-- NULL check
IF
  category_avg_rating IS NULL
THEN
  SELECT 0.0 + NEW.review_rating INTO category_avg_rating;
END IF;


IF
  NEW.review_rating IS NOT NULL
THEN
  UPDATE takes_care t
  SET carer_price = category_base_price * (1.00 + category_avg_rating / 10.00)
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
------------------------------------------------ END ----------------------------------------------------------
--------------------- Function and Trigger to enforce constraints for insertion of bids ---------------------
CREATE OR REPLACE FUNCTION insert_bids_check()
RETURNS TRIGGER AS
$$
BEGIN
IF
  NEW.is_successful = true
THEN
  RAISE EXCEPTION 'Cannot insert bid that are already successful!';
END IF;

IF
  (SELECT
  (SELECT belongs FROM pets WHERE pname = NEW.pname AND owner_name = NEW.owner_name)
  NOT IN
  (SELECT category_name FROM categories))
THEN
  RAISE EXCEPTION 'Carer does not take care of this category of pets!';
END IF;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER insert_bids_check_trigger
BEFORE INSERT ON bids
FOR ROW EXECUTE PROCEDURE insert_bids_check();
------------------------------------------------ END ----------------------------------------------------------
-------Function and Trigger to recalculate carer prices whenever the base price of a category is updated-------
CREATE OR REPLACE FUNCTION recalculate_carer_prices()
RETURNS TRIGGER AS 
$$
declare loop_row RECORD;
declare carer_rating NUMERIC;
BEGIN
FOR loop_row IN
  SELECT DISTINCT carer_name FROM takes_care tc WHERE tc.category_name = OLD.category_name
LOOP
  SELECT AVG(review_rating) INTO carer_rating
  FROM bids b
  WHERE
    b.carer_name = loop_row.carer_name AND
    OLD.category_name = (
      SELECT belongs
      FROM pets p
      WHERE
        p.pname = b.pname AND
        p.owner_name = b.owner_name
  );

  UPDATE takes_care
  SET carer_price = CASE
    WHEN carer_rating IS NULL
    THEN NEW.base_price
    ELSE NEW.base_price * (1.00 + carer_rating / 10.00) END
  WHERE carer_name = loop_row.carer_name AND category_name = OLD.category_name;
END LOOP;
RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER recalculate_carer_price_trigger
BEFORE UPDATE ON categories
FOR ROW EXECUTE PROCEDURE recalculate_carer_prices();
------------------------------------------------ END ----------------------------------------------------------
-- Function and Trigger to add all days of the year into the working_days table if the new carer is a fulltimer --
CREATE OR REPLACE FUNCTION initialize_working_days()
RETURNS TRIGGER AS 
$$
declare loop_row RECORD;
BEGIN
IF
  NOT NEW.is_fulltime
THEN
  RETURN NEW;
ELSE
  UPDATE carers SET is_fulltime = false WHERE carer_name = NEW.carer_name;
  FOR loop_row IN
    SELECT generate_series(
      DATE(date_part('year', now()) || '-01-01'),
      (DATE(date_part('year', now()) || '-01-01') + INTERVAL '1 year' - INTERVAL '1 day')::DATE,
      '1 day'::interval
    ) AS date
  LOOP
    INSERT INTO working_days VALUES(loop_row.date, NEW.carer_name, 0);
  END LOOP;
  UPDATE carers SET is_fulltime = true WHERE carer_name = NEW.carer_name;
END IF;
RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER initialize_working_days_trigger
AFTER INSERT ON carers
FOR ROW EXECUTE PROCEDURE initialize_working_days();
------------------------------------------------ END ----------------------------------------------------------
-- Function and Trigger to ensure full-time Care Taker works for a minimum of 2 × 150 consecutive days a year! --
CREATE OR REPLACE FUNCTION fulltime_min_working_days()
RETURNS TRIGGER AS 
$$
DECLARE loop_row RECORD;
DECLARE consecutive_150_Count INTEGER := 0;
DECLARE counter INTEGER := 1;
DECLARE prev_date DATE := NULL;
BEGIN

IF
  OLD.number_of_pets > 0
THEN
  RAISE EXCEPTION 'Cannot apply for leave if there is at least one Pet taken by carer. ';
END IF;

IF
  (SELECT is_fulltime FROM carers WHERE carer_name = OLD.carer_name)
THEN
  FOR loop_row IN
    SELECT working_date
    FROM working_days
    WHERE
      carer_name = OLD.carer_name AND
      working_date <> OLD.working_date
    ORDER BY working_date ASC
  LOOP
    IF
      loop_row.working_date - prev_date = 1
    THEN
      counter := counter + 1;
    ELSE
      counter := 1;
    END IF;
    prev_date := loop_row.working_date;
    IF
      counter = 150 OR counter = 300
    THEN
      consecutive_150_Count := consecutive_150_Count + 1;
    END IF;
  END LOOP;
  IF
    consecutive_150_Count < 2
  THEN
    RAISE EXCEPTION 'Full-time Care Taker must work for a minimum of 2 × 150 consecutive days a year!';
  END IF;
END IF;
RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER fulltime_min_working_days_trigger
BEFORE DELETE ON working_days
FOR ROW EXECUTE PROCEDURE fulltime_min_working_days();
------------------------------------------------ END ----------------------------------------------------------
----------------- Function and Trigger to accept bids for fulltimers whenever possible -----------------
CREATE OR REPLACE FUNCTION fulltime_auto_accept_bid()
RETURNS TRIGGER AS 
$$
DECLARE loop_row RECORD;
DECLARE can_accept BOOLEAN := TRUE;
BEGIN
IF
  (SELECT is_fulltime FROM carers WHERE carer_name = NEW.carer_name)
THEN
  FOR loop_row IN
    SELECT generate_series(NEW.start_date, OLD.start_date, '1 day'::INTERVAL) AS date
  LOOP
    can_accept := can_accept AND (
      SELECT number_of_pets
      FROM working_days
      WHERE carer_name = NEW.carer_name AND working_date = loop_row.date
    ) < 5;
  END LOOP;
END IF;
IF
  can_accept
THEN
  UPDATE bids SET is_successful = TRUE
  WHERE
    start_date = NEW.start_date AND end_date = NEW.end_date AND
    carer_name = NEW.carer_name AND owner_name = NEW.owner_name AND
    pname = NEW.pname;
END IF;
RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER fulltime_auto_accept_bid_trigger
AFTER INSERT ON bids
FOR ROW EXECUTE PROCEDURE fulltime_auto_accept_bid();
------------------------------------------------ END ----------------------------------------------------------
