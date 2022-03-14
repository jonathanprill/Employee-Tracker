INSERT INTO department (department_name)
VALUES ("Management"),
       ("Sales"),
       ("Engineering");






INSERT INTO roles (title, salary, department_id)
VALUES ("Engineer", 90000, 3),
       ("Salesman", 80000, 2),
       ("Manager", 120000, 1);




INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Smith", 1, 1),
       ("Brad", "Dallas", 3, 2),
       ("Pauli", "Brock", 2, 2);