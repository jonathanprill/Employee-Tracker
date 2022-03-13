INSERT INTO department (department_name)
VALUES ("SALES"),
       ("ENGINEERING"),
       ("LAW");






INSERT INTO roles (title, salary, department_id)
VALUES ("Engineer", 100, 1),
       ("Salesman", 200, 2),
       ("Manager", 100, 2);




INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Dan", "Smith", 1, 1),
       ("Finn", "Banks", 2, 2),
       ("Ethan", "Clay", 1, 2);