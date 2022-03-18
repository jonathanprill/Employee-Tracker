DROP DATABASE IF EXISTS police_db;
CREATE DATABASE police_db;

USE police_db;



CREATE TABLE crew (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  crew_name VARCHAR(30) NOT NULL
);


CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  crew_id INT,
  FOREIGN KEY (crew_id) REFERENCES crew(id) ON DELETE SET NULL
);


CREATE TABLE suspect (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);

