CREATE DATABASE petcaringdb;

-- CREATE TABLE todo(
--   todo_id SERIAL PRIMARY KEY,
--   description VARCHAR(255)
-- );

DROP TABLE IF EXISTS owners;
DROP TABLE IF EXISTS credit_card;

CREATE TABLE owners(
    owner_userName VARCHAR(20) NOT NULL REFERENCES accounts(username) ON DELETE Cascade,
	PRIMARY KEY(owner_userName)
);

CREATE TABLE credit_card(
    owner_userName VARCHAR(20) REFERENCES owners(owner_userName) ON DELETE Cascade,
    credit_card_num INTEGER NOT NULL,
    cvv INTEGER NOT NULL,
    expiry_dade DATE NOT NULL,
    PRIMARY KEY(owner_userName, credit_card_num)

);

INSERT INTO owners VALUES
('adi'),
('jy'),
('dearvae'),
('gycc'),
('figo'),
('zz');

INSERT INTO credit_card VALUES
('adi', 123456789333, 111, 2030-01-02),
('jy', 123457890444, 222, 2020-11-11),
('dearvae', 245373849333, 333, 2022-01-01),
('gycc',435787654444, 444, 2023-01-04),
('figo', 647234516211, 555, 2025-02-02),
('zz',264829362516, 666, 2020-12-12);

