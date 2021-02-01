DROP DATABASE IF EXISTS employee_DB;
CREATE DATABASE employee_DB;

USE employee_DB;

CREATE TABLE department(
    id INT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role(
    id INT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL
);

CREATE TABLE employee(
    id INT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL
);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Megan", "Bryan", 12, null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (2, "Jack", "Sherman", 24, 1);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (3, "Lucy", "Lippincott", 36, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (12, "Manager", "70000", 10);

INSERT INTO role (id, title, salary, department_id)
VALUES (24, "Engineer", "60000", 10);

INSERT INTO role (id, title, salary, department_id)
VALUES (36, "Mechanic", "50000", 10);

INSERT INTO department (id, name)
VALUES (10, "Production");

SELECT employee.id, first_name, last_name, role.title, role.salary, role.department_id, manager_id
FROM employee
RIGHT JOIN role ON employee.role_id = role.id;