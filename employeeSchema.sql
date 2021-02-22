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
("Laura", "Smith", 3, 1),
("Jack", "Sherman", 2, 2),
("Lucy", "Lippincott", 3, 2);

INSERT INTO role 
(title, salary, department_id)
VALUES 
("Manager", "70000", 1),
("Engineer", "60000", 1),
("Mechanic", "50000", 1);

INSERT INTO department (name)
VALUES ("Production");