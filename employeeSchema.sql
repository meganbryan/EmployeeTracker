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
VALUES (2, "Laura", "Smith", 36, 1);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (3, "Jack", "Sherman", 24, 2);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (4, "Lucy", "Lippincott", 36, 2);

INSERT INTO role (id, title, salary, department_id)
VALUES (12, "Manager", "70000", 10);

INSERT INTO role (id, title, salary, department_id)
VALUES (24, "Engineer", "60000", 10);

INSERT INTO role (id, title, salary, department_id)
VALUES (36, "Mechanic", "50000", 10);

INSERT INTO department (id, name)
VALUES (10, "Production");

SELECT employee.id AS `ID`, CONCAT_WS(', ', employee.last_name, employee.first_name) AS `Name`, role.title AS `Role`, role.salary AS `Salary`, department.name AS `Department`, CONCAT_WS(', ', managerInfo.last_name, managerInfo.first_name) AS `Manager`
FROM employee
RIGHT JOIN role ON employee.role_id = role.id
LEFT JOIN department on role.department_id = department.id
LEFT JOIN employee AS managerInfo on employee.manager_id = managerInfo.id;

SELECT role.id AS `ID`,  role.title AS `Role`, role.salary AS `Salary`, department.name AS `Department`
FROM role
INNER JOIN department on role.department_id = department.id;