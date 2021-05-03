CREATE TABLE IF NOT EXISTS roles (
    id serial PRIMARY KEY,
    value varchar NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS activation_codes (
    id serial PRIMARY KEY,
    code varchar NOT NULL UNIQUE,
    expiration timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    email varchar NOT NULL UNIQUE,
    password varchar NOT NULL,
    last_name varchar NOT NULL,
    first_name varchar NOT NULL,
    cnp varchar NOT NULL,
    address varchar NOT NULL,
    role_id integer REFERENCES roles(id),
    activation_code_id integer REFERENCES activation_codes(id)
);

INSERT INTO roles (value) VALUES ('ADMIN');
INSERT INTO roles (value) VALUES ('SUPPORT');
INSERT INTO roles (value) VALUES ('USER');
INSERT INTO users (email, password, last_name, first_name, cnp, address, role_id)
    VALUES ('admin@localhost', '$2y$10$BLMZFAnCPXX0cVRmdPP3Meu3NR/xWucAyQ4aAW2z57RlLdLPvH0Hi', 'Admin', '', '', '', 1);