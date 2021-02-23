DROP DATABASE IF EXISTS employee_DB;
CREATE DATABASE employee_DB;

USE employee_DB;

CREATE TABLE department(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL
);

CREATE TABLE employee(
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL
);

INSERT INTO 
employee (first_name, last_name, role_id, manager_id)
VALUES 
("Megan", "Bryan", 1, null),
("Laura", "Smith", 1, 1),
("Jack", "Sherman", 2, 2),
("Tyler", "Whitman", 3, 1),
("Sean", "Jensen", 4, 2),
("Jessica", "Young", 5, 1),
("Heather", "Ford", 6, 2),
("Liam", "Phillips", 5, 1),
("Brian", "Eberly", 3, 2),
("Lucy", "Lippincott", 3, 1);

INSERT INTO role 
(title, salary, department_id)
VALUES 
("Manager", "90000", 2),
("Engineer", "60000", 2),
("Designer", "70000", 2),
("Contractor", "85000", 1),
("Maintenance", "65000", 1),
("Mechanic", "50000", 1);

INSERT INTO 
department (name)
VALUES 
("Production"),
("Design");