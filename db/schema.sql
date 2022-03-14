DROP DATABASE IF EXISTS team_db;
CREATE DATABASE team_db;

USE team_db;



CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL
);


CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);


CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);

-- WITH RECURSIVE Emp_CTE (id, first_name, last_name, manager_id, Manager_name, namepath)
-- AS (
--     SELECT id, first_name, last_name, manager_id, cast(NULL as varchar), first_name as namepath
--     FROM employee
--     WHERE manager_id IS NULL
--     UNION ALL 
--       SELECT e.id, e.first_name, e.last_name, e.manager_id, Emp_CTE.first_name
--       , Emp_CTE.namepath || '/' || e.Name 
--       FROM employee e
--       INNER JOIN Emp_CTE ON Emp_CTE.id = e.manager_id
-- );