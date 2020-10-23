CREATE DATABASE petcaringdb;

-- CREATE TABLE todo(
--   todo_id SERIAL PRIMARY KEY,
--   description VARCHAR(255)
-- );


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

