const mysql = require("mysql");
const inquirer = require("inquirer");
const CTable = require("console.table")

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
            choices: ["ADD", "VIEW", "UPDATE ROLE", "END"]
        })
        .then((answer) => {
            if (answer.action === "ADD") {
                addSomething ();
            } 
            else if (answer.action === "VIEW") {
                viewSomething();
            } 
            else if (answer.action === "UPDATE ROLE") {
                updateRole ();
            } 
            else {
                connection.end();
            }
        });
};

const updateRole = () => {
    connection.query('SELECT first_name,last_name FROM employee', (err, results) => {
    inquirer
        .prompt([
            {
                name: 'choice',
                type: 'list',
                choices() {
                    const choiceArray = [];
                    results.forEach(({ first_name, last_name }) => {
                        choiceArray.push(`${last_name}, ${first_name}`);
                    });
                    return choiceArray;
                },
                message: 'Update role for which employee?',
            },
            {
                name: 'role_id',
                type: 'input',
                message: 'What would you like their new role ID to be?'
            }
        ])
        .then((answer) => {
            let ansArray = answer.choice.split(', ')
            const query = connection.query(
                'UPDATE employee SET ? WHERE ? AND ?', 
                [
                    {
                        role_id: answer.role_id
                    },
                    {
                        last_name: ansArray[0]
                    },
                    {
                        first_name: ansArray[1]
                    }
                ], 
                (err, res) => {
                    if (err) throw err;
                    init();
                }
            );
            console.log(query.sql);
        });
    })
}

const viewSomething = () => {
    let queryString = ""
    inquirer
        .prompt({
            name: "view_type",
            type: "list",
            message: "What category would you like to view?",
            choices: ["DEPARTMENT", "ROLE", "EMPLOYEE"]
        })
        .then((answer) => {
            if (answer.view_type === "EMPLOYEE") {
                queryString = "SELECT employee.id AS `ID`, CONCAT_WS(', ', employee.last_name, employee.first_name) AS `Name`, role.title AS `Role`, role.salary AS `Salary`, department.name AS `Department`, CONCAT_WS(', ', managerInfo.last_name, managerInfo.first_name) AS `Manager` FROM employee INNER JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee AS managerInfo on employee.manager_id = managerInfo.id ORDER by `Name`;"
            }
            else if (answer.view_type === "ROLE"){
                queryString = 'SELECT role.id AS `ID`,  role.title AS `Role`, role.salary AS `Salary`, department.name AS `Department` FROM role INNER JOIN department on role.department_id = department.id ORDER BY `id`'
            }
            else {
                queryString = 'SELECT department.id AS `ID`, department.name AS `Department` FROM department ORDER BY `ID`'
            }
            connection.query(queryString, (err, results) => {
                if (err) throw err;
                console.table(results)
                init();
            });
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

const addDepartment = () => {
    inquirer
        .prompt([
            {
                name: 'dept_id',
                type: 'input',
                message: 'What is the department id number?'
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
                message: 'What is the id number of the department?'
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
                message: 'What is their id number?'
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
                message: 'What is the id number for their role?'
            },
            {
                name: 'manager',
                type: 'input',
                message: 'What is the id number of their manager?'
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
