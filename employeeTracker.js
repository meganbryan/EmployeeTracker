const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employee_DB",
});

const init = () => {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Would you like to add?",
            choices: ["DEPARTMENT", "ROLE", "EMPLOYEE"],
        })
        .then((answer) => {
            if (answer.action === "DEPARTMENT") {
                addDepartment ();
            } 
            else if (answer.action === "ROLE") {
                console.log("ADD ROLE");
            } 
            else if (answer.action === "EMPLOYEE") {
                console.log("ADD EMPLOYEE");
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
                message: 'What is the department id?',
            },
            {
                name: 'dept_name',
                type: 'input',
                message: 'What is the department name?',
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

connection.connect((err) => {
    if (err) throw err;
    init ()
});
