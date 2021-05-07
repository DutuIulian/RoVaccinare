CREATE TABLE IF NOT EXISTS roles (
    id serial PRIMARY KEY,
    value varchar NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS activation_codes (
    id serial PRIMARY KEY,
    code varchar NOT NULL UNIQUE,
    expiration timestamp NOT NULL,
    used boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    email varchar NOT NULL UNIQUE,
    password varchar NOT NULL,
    last_name varchar NOT NULL,
    first_name varchar NOT NULL,
    cnp varchar NOT NULL,
    address varchar NOT NULL,
    activated boolean DEFAULT false,
    role_id integer REFERENCES roles(id),
    activation_code_id integer REFERENCES activation_codes(id)
);

CREATE TABLE IF NOT EXISTS counties (
    id serial PRIMARY KEY,
    name varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS localities (
    id serial PRIMARY KEY,
    name varchar NOT NULL,
    county_id integer REFERENCES counties(id)
);

CREATE TABLE IF NOT EXISTS test_centers (
    id serial PRIMARY KEY,
    name varchar NOT NULL,
    address varchar NOT NULL,
    locality_id integer REFERENCES localities(id)
);

CREATE TABLE IF NOT EXISTS tests (
    id serial PRIMARY KEY,
    name varchar NOT NULL,
    available_quantity integer DEFAULT 0,
    center_id integer REFERENCES test_centers(id)
);

CREATE TABLE IF NOT EXISTS test_appointments (
    id serial PRIMARY KEY,
    date_time timestamp NOT NULL,
    status VARCHAR DEFAULT 'Programat',
    test_id integer REFERENCES tests(id),
    user_id integer REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS vaccine_centers (
    id serial PRIMARY KEY,
    name varchar NOT NULL,
    address varchar NOT NULL,
    locality_id integer REFERENCES localities(id)
);

CREATE TABLE IF NOT EXISTS vaccines (
    id serial PRIMARY KEY,
    name varchar NOT NULL,
    available_quantity integer DEFAULT 0,
    center_id integer REFERENCES vaccine_centers(id)
);

CREATE TABLE IF NOT EXISTS vaccine_appointments (
    id serial PRIMARY KEY,
    date_time timestamp NOT NULL,
    status VARCHAR DEFAULT 'Programat',
    vaccine_id integer REFERENCES vaccines(id),
    user_id integer REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS news (
    id serial PRIMARY KEY,
    title varchar NOT NULL,
    content varchar NOT NULL,
    time_posted timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS questions (
    id serial PRIMARY KEY,
    title varchar NOT NULL,
    question varchar NOT NULL,
    answer varchar DEFAULT '',
    user_id integer REFERENCES users(id),
    support_user_id integer DEFAULT 1 REFERENCES users(id),
    pinned boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS test_center_reviews (
    id serial PRIMARY KEY,
    title varchar NOT NULL,
    review varchar NOT NULL,
    date timestamp DEFAULT NOW(),
    user_id integer REFERENCES users(id),
    center_id integer REFERENCES test_centers(id)
);

INSERT INTO roles (value) VALUES ('ADMIN');
INSERT INTO roles (value) VALUES ('SUPPORT');
INSERT INTO roles (value) VALUES ('USER');
INSERT INTO users (email, password, last_name, first_name, cnp, address, activated, role_id)
    VALUES ('admin@localhost', '$2y$10$BLMZFAnCPXX0cVRmdPP3Meu3NR/xWucAyQ4aAW2z57RlLdLPvH0Hi', 'Admin', '', '', '', true, 1);