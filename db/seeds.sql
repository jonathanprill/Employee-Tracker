INSERT INTO crew (crew_name)
VALUES ("Junior Crew"),
       ("Soprano Crew"),
       ("Curto Crew");






INSERT INTO roles (title, salary, crew_id)
VALUES ("Capo", 90000, 3),
       ("Soldier", 70000, 2),
       ("Boss", 150000, 1);




INSERT INTO suspect (first_name, last_name, role_id, manager_id)
VALUES ("Richie", "Aprile", 3, 2),
       ("Pauli", "Gualtieri", 2, 3),
       ("Tony", "Soprano", 1, NULL);