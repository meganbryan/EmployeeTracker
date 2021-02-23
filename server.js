const mysql = require("mysql");
const inquirer = require("inquirer");
const CTable = require("console.table")
let empArray = []
let roleArray = []
let managerArray = []
let deptArray = [] 

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_DB"
});

const initQueries = () => {
    connection.query("SELECT CONCAT_WS(', ', employee.last_name, employee.first_name) AS `Name`, employee.id AS `ID` FROM employee ORDER by `Name`", (err, results) => {
        empResults = 
        empArray = [];
        results.forEach(({ Name, ID }) => {
            empArray.push(`${ID}: ${Name}`);
        });
        return empArray;
    })
    connection.query("SELECT role.title AS `Title`, role.id AS `ID` FROM role ORDER by `ID`", (err, results) => {
        roleArray = [];
        results.forEach(({ Title, ID }) => {
            roleArray.push(`${ID}: ${Title}`);
        });
        return roleArray;
    })
    connection.query("SELECT CONCAT_WS(', ', employee.last_name, employee.first_name) AS `Name`, employee.id AS `ID` FROM employee WHERE employee.role_id = 1 ORDER by `Name`", (err, results) => {
        managerArray = [];
        results.forEach(({ Name, ID }) => {
            managerArray.push(`${ID}: ${Name}`);
        });
        return managerArray;
    })
    connection.query("SELECT department.name AS `Department`, department.id AS `ID` FROM department ORDER by `ID`", (err, results) => {
        deptArray = [];
        results.forEach(({ Department, ID }) => {
            deptArray.push(`${ID}: ${Department}`);
        });
        return deptArray;
    })
    init ()
}

const init = () => {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["ADD", "VIEW", "UPDATE", "DELETE", "END"]
        })
        .then((answer) => {
            if (answer.action === "ADD") {
                addCategory ();
            } 
            else if (answer.action === "VIEW") {
                viewCategory();
            } 
            else if (answer.action === "UPDATE") {
                updateCategory ();
            } 
            else if (answer.action === "DELETE") {
                deleteEmployee ();
            } 
            else {
                connection.end();
            }
        });
};

const updateCategory = () => {
    inquirer
        .prompt({
            name: "update",
            type: "list",
            message: "Which would you like to update?",
            choices: ["ROLE", "MANAGER"]
        })
        .then((answer) => {
            if (answer.update === "ROLE") {
                updateRole ();
            } 
            else if (answer.update === "MANAGER") {
                updateManager();
            } 
        });
}

const updateRole  = () => {
    inquirer
        .prompt([
            {
                name: 'choice',
                type: 'list',
                choices: empArray,
                message: 'Update role for which employee?',
            },
            {
                name: 'role_id',
                type: 'list',
                choices: roleArray,
                message: 'What would you like their new role to be?'
            }]
        )
        .then((answer) => {
            let empAnswer = answer.choice.split(':').join(',').split(', ')
            let roleAnswer = answer.role_id.split(':').join(',').split(', ')
            connection.query(
                'UPDATE employee SET ? WHERE ? AND ?', 
                [
                    {
                        role_id: roleAnswer[0]
                    },
                    {
                        last_name: empAnswer[1]
                    },
                    {
                        first_name: empAnswer[2]
                    }
                ], 
                (err, res) => {
                    if (err) throw err;
                    console.log(`
                    ------ ${empAnswer[2]} ${empAnswer[1]}'s role is now ${roleAnswer[1]} ------
                    `);
                    initQueries();
                }
            );
        });
}

const updateManager  = () => {
    inquirer
        .prompt([
            {
                name: 'choice',
                type: 'list',
                choices: empArray,
                message: 'Update manager for which employee?',
            },
            {
                name: 'newManager',
                type: 'list',
                choices: managerArray,
                message: 'Who would you like their new manager to be?',
            }
        ])
        .then((answer) => {
            let ansArrayChoice = answer.choice.split(':').join(',').split(', ')
            let ansArrayManager = answer.newManager.split(':').join(',').split(', ')
            const query = connection.query(
                'UPDATE employee SET ? WHERE ?', 
                [
                    {
                        manager_id: ansArrayManager[0]
                    },
                    {
                        id: ansArrayChoice[0]
                    },
                ], 
                (err, res) => {
                    if (err) throw err;
                    console.log(`
                    ------ ${ansArrayChoice[2]} ${ansArrayChoice[1]}'s manager is now ${ansArrayManager[2]} ${ansArrayManager[1]} ------
                    `);
                    initQueries();
                }
            );
    })
};

const viewCategory = () => {
    let queryString = ""
    inquirer
        .prompt({
            name: "view_type",
            type: "list",
            message: "What category would you like to view?",
            choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "BY MANAGER", "DEPARTMENT BUDGETS"]
        })
        .then((answer) => {
            if (answer.view_type === "EMPLOYEE") {
                queryString = "SELECT CONCAT_WS(', ', employee.last_name, employee.first_name) AS `Name`, role.title AS `Role`, role.salary AS `Salary`, department.name AS `Department`, CONCAT_WS(', ', managerInfo.last_name, managerInfo.first_name) AS `Manager` FROM employee INNER JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee AS managerInfo on employee.manager_id = managerInfo.id ORDER by `Name`;"
                console.log(`
                ------ Retrieving employees in order alphabetically ------
                `)
                connectionView(queryString)
            }
            else if (answer.view_type === "ROLE"){
                queryString = 'SELECT role.id AS `ID`,  role.title AS `Role`, role.salary AS `Salary`, department.name AS `Department` FROM role INNER JOIN department on role.department_id = department.id ORDER BY `id`'
                console.log(`
                ------ Retrieving roles in order by ID ------
                `)
                connectionView(queryString)
            }
            else if (answer.view_type === "DEPARTMENT"){
                queryString = 'SELECT department.id AS `ID`, department.name AS `Department` FROM department ORDER BY `ID`'
                console.log(`
                ------ Retrieving departments in order by ID ------`
                )
                connectionView(queryString)
            }
            else if (answer.view_type === "DEPARTMENT BUDGETS"){
                departmentTotal ()
            }
            else {
                byManager() 
            };
        });
};

const byManager  = () => {
        inquirer
            .prompt({   
                name: 'manager',
                type: 'list',
                choices: managerArray,
                message: 'View by which manager?'
            })
            .then((answer) => {
                let ansArrayManager = answer.manager.split(':').join(',').split(', ')
                const queryString = `SELECT CONCAT_WS(', ', employee.last_name, employee.first_name) AS 'Name', role.title AS 'Role', role.salary AS 'Salary', department.name AS 'Department', CONCAT_WS(', ', managerInfo.last_name, managerInfo.first_name) AS 'Manager' FROM employee INNER JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee AS managerInfo on employee.manager_id = managerInfo.id WHERE employee.manager_id = '${ansArrayManager[0]}' ORDER by 'Name'`
                console.log(`
                ------ Retrieving employees managed by ${ansArrayManager[2]} ${ansArrayManager[1]} in order alphabetically ------
                `)
                connectionView(queryString)
    }); 
}

const connectionView = (queryString) => {
    connection.query(queryString, (err, results) => {
        if (err) throw err;
        console.table(results)
        initQueries();
    })
};

const addCategory = () => {
    inquirer
        .prompt({
            name: "add_type",
            type: "list",
            message: "What category would you like to add?",
            choices: ["DEPARTMENT", "ROLE", "EMPLOYEE"]
        })
        .then((answer) => {
            if (answer.add_type === "DEPARTMENT") {
                addDepartment ();
            } 
            else if (answer.add_type === "ROLE") {
                addRole ();
            } 
            else if (answer.add_type === "EMPLOYEE") {
                addEmployee ();
            }
        });
};

const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'dept_name',
            type: 'input',
            message: 'What is the department name?'
        }
    ])
    .then((answer) => {
        console.log(`
        ------ Department: ${answer.dept_name} is being created ------
        `)
        connection.query(
            "INSERT INTO department SET ?",
            {
                name: answer.dept_name
            },
            (err) => {
                if (err) throw err;
                console.log(`
                -------- DEPARTMENT CREATED SUCESSFULLY --------
                `);
                initQueries();
            }
        );
    });
};

const addRole = () => {
    inquirer.prompt([
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
                type: 'list',
                choices: deptArray,
                message: 'Which department is this role in?'
            }
    ])
    .then((answer) => {
        console.log(`
        ------ Role: ${answer.role_title} is being created ------
        `)
        connection.query(
            "INSERT INTO role SET ?",
            {
                title: answer.role_title,
                salary: answer.salary,
                department_id: answer.dept_id.split(':').join(',').split(', ')[0]
            },
            (err) => {
                if (err) throw err;
                console.log(`
                -------- ROLE CREATED SUCESSFULLY --------
                `);
                initQueries();
            }
        );
    });
};

const addEmployee = () => {
    inquirer.prompt([
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
            type: 'list',
            choices: roleArray,
            message: 'What is their role?'
        },
        {
            name: 'manager',
            type: 'list',
            choices: managerArray,
            message: 'Who is their manager?'
        }
    ])
    .then((answer) => {
        console.log(`
        ------ Employee: ${answer.first_name} ${answer.last_name} is being created ------
        `)
        connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.role_id.split(':').join(',').split(', ')[0],
                manager_id: answer.manager.split(':').join(',').split(', ')[0]
            },
            (err) => {
                if (err) throw err;
                console.log(`
                -------- EMPLOYEE CREATED SUCESSFULLY --------
                `);
                initQueries();
            }
        );
    });
};

const deleteEmployee  = () => {
    inquirer
        .prompt([
            {
                name: 'choice',
                type: 'list',
                choices: empArray,
                message: 'Delete which employee?',
            },
            {
                name: 'confirmation',
                type: 'list',
                choices: ["DELETE", "CANCEL"],
                message: 'Are you sure you want to delete? This action cannot be undone.',
            }
        ])
        .then((answer) => {
            let ansArrayChoice = answer.choice.split(':').join(',').split(', ')
            if (answer.confirmation === "DELETE") {
                const query = connection.query(
                    'DELETE FROM employee WHERE ?', 
                    [
                        {
                            id: ansArrayChoice[0]
                        }
                    ], 
                    (err, res) => {
                        if (err) throw err;
                        console.log(`
                        ------ ${ansArrayChoice[2]} ${ansArrayChoice[1]}'s info has been removed ------
                        `);
                        initQueries();
                    }
                );
            }
            else {
                console.log ("------ Delete Cancelled ------")
                initQueries();
            }
    })
};

const departmentTotal = () => {
    inquirer
        .prompt({   
            name: 'department',
            type: 'list',
            choices: deptArray,
            message: 'View budget for which department?'
        })
        .then((answer) => {
            let ansArrayDept = answer.department.split(':').join(',').split(', ')
            const query = connection.query(
                "SELECT SUM (role.salary) AS `total` FROM role WHERE ?", 
                [
                    {
                        department_id: ansArrayDept[0]
                    }
                ], 
                (err, results) => {
                    if (err) throw err;
                    console.log(`
                    ------ The total budget for ${ansArrayDept[1]} is $${results[0].total} ------
                    `);
                    initQueries();
                }
            );
    }); 
}

connection.connect((err) => {
    if (err) throw err;
    initQueries()
});
