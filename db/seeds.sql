INSERT INTO all_departments (department_name)
VALUES ("English"),
       ("Math"),
       ("Managment"),
       ("Science");

INSERT INTO all_roles (job_title, department_id, salary)
VALUES ("Teacher", 1, 100000.00),
       ("Teacher", 2, 100000.00),
       ("Principle", 3, 150000.00),
       ("Vice Principle", 4, 125000.00),
       ("Teacher", 1, 1000000.00),
       ("Student Teacher", 2, 75000.00),
       ("Student Teacher", 3, 75000.00);

INSERT INTO all_employees (first_name, last_name, role_id, manager_id)
VALUES ("Creepella", "Gruesome", 1, null),
       ("Pearl", "Slaghoople", 2, 1),
       ("Fred", "Flinstone", 3, 2),
       ("Betty", "Rubble", 4, null),
       ("Barney", "Rubble", 5, 3),
       ("Pebbles", "Flinstone", 1, 4),
       ("Bam", "Rubble", 2, 1),
       ("Wilma", "Flinstone", 3, 2);

