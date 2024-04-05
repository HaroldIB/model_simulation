CREATE DATABASE IF NOT EXISTS user_login;

USE user_login;

CREATE TABLE IF NOT EXISTS users (
    email VARCHAR(100) NOT NULL PRIMARY KEY, name varchar(255) NOT NULL, password varchar(255) NOT NULL
);