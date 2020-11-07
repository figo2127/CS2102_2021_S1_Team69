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