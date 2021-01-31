const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_DB"
});

const init = () => {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Would you like to do?",
            choices: ["ADD", "VIEW", "UPDATE EMPLOYEE ROLES", "END"]
        })
        .then((answer) => {
            if (answer.action === "ADD") {
                addSomething ();
            } 
            else if (answer.action === "VIEW") {
                viewSomething();
            } 
            else if (answer.action === "UPDATE") {
                console.log("update roles");
                connection.end();
            } 
            else {
                connection.end();
            }
        });
};

const addSomething = () => {
    inquirer
        .prompt({
            name: "add_type",
            type: "list",
            message: "What category would you like to add?",
            choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "CANCEL"]
        })
        .then((answer) => {
            if (answer.add_type === "DEPARTMENT") {
                addDepartment ();
            } 
            else if (answer.add_type === "ROLE") {
                addRole();
            } 
            else if (answer.add_type === "EMPLOYEE") {
                addEmployee ();
            } 
            else {
                connection.end();
            }
        });
};

const viewSomething = () => {
    inquirer
        .prompt({
            name: "view_type",
            type: "list",
            message: "What category would you like to view?",
            choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "CANCEL"]
        })
        .then((answer) => {
            if (answer.view_type === "DEPARTMENT") {
                console.log("view departments");
                connection.end();
            } 
            else if (answer.view_type === "ROLE") {
                console.log("view roles");
                connection.end();
            } 
            else if (answer.view_type === "EMPLOYEE") {
                console.log("view employees");
                connection.end();
            } 
            else {
                connection.end();
            }
        });
};

const addDepartment = () => {
    inquirer
        .prompt([
            {
                name: 'dept_id',
                type: 'input',
                message: 'What is the department id?'
            },
            {
                name: 'dept_name',
                type: 'input',
                message: 'What is the department name?'
            }
        ])
    .then((answer) => {
        connection.query(
            'INSERT INTO department SET ?',
            {
                id: answer.dept_id,
                name: answer.dept_name
            },
            (err) => {
                if (err) throw err;
                console.log('Department created successfully.');
                init();
            }
        );
    });
};

const addRole = () => {
    inquirer
        .prompt([
            {
                name: 'role_id',
                type: 'input',
                message: 'What is the id for the role?'
            },
            {
                name: 'role_title',
                type: 'input',
                message: 'What is the title of the role?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary for the role?'
            },
            {
                name: 'dept_id',
                type: 'input',
                message: 'What is the id of the department?'
            }
        ])
    .then((answer) => {
        connection.query(
            'INSERT INTO role SET ?',
            {
                id: answer.role_id,
                title: answer.role_title,
                salary: answer.salary,
                department_id: answer.dept_id
            },
            (err) => {
                if (err) throw err;
                console.log('Role created successfully.');
                init();
            }
        );
    });
};

const addEmployee = () => {
    inquirer
        .prompt([
            {
                name: 'employee_id',
                type: 'input',
                message: 'What is their id?'
            },
            {
                name: 'first_name',
                type: 'input',
                message: 'What is their first name?'
            },
            {
                name: 'last_name',
                type: 'input',
                message: 'What is their last name?'
            },
            {
                name: 'role_id',
                type: 'input',
                message: 'What is the id for their role?'
            },
            {
                name: 'manager',
                type: 'input',
                message: 'What is the id of their manager?'
            }
        ])
    .then((answer) => {
        connection.query(
            'INSERT INTO employee SET ?',
            {
                id: answer.role_id,
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.role_id,
                manager_id: answer.manager
            },
            (err) => {
                if (err) throw err;
                console.log('Employee created successfully.');
                init();
            }
        );
    });
};

connection.connect((err) => {
    if (err) throw err;
    init ()
});
