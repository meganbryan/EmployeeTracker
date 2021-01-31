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
                console.log("ADD DEPARTMENT");
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

connection.connect((err) => {
    if (err) throw err;
    init ()
});
