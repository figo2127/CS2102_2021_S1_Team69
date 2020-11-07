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
  carer_limit := 5;
ELSE
  carer_limit := 2;
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
BEFORE UPDATE OF is_successful ON bids
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
RETURN NEW;
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
  FOR loop_row IN
    SELECT generate_series(
      DATE(date_part('year', now()) || '-01-01'),
      (DATE(date_part('year', now()) || '-01-01') + INTERVAL '1 year' - INTERVAL '1 day')::DATE,
      '1 day'::interval
    ) AS date
  LOOP
    INSERT INTO working_days VALUES(loop_row.date, NEW.carer_name, 0);
  END LOOP;
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
  can_accept := can_accept AND NOT EXISTS(
    SELECT *
    FROM bids
    WHERE
    is_successful AND pname = NEW.pname AND owner_name = NEW.owner_name AND carer_name = NEW.carer_name AND
    (start_date <> NEW.start_date OR end_date <> NEW.end_date) AND
    ((start_date >= NEW.start_date AND start_date <= NEW.end_date) OR
    (end_date >= NEW.start_date AND end_date <= NEW.end_date) OR
    (NEW.start_date >= start_date AND NEW.start_date <= end_date) OR
    (NEW.end_date >= start_date AND NEW.end_date <= end_date))
  );
  insert into test values (can_accept);
ELSE
  RETURN NEW;
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