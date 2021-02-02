const mysql = require("mysql");
const inquirer = require("inquirer");
const CTable = require("console.table")

const deptPrompt = [
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
];
const rolePrompt = [
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
];
const emplPrompt = [
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
];

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
            choices: ["ADD", "VIEW", "UPDATE", "END"]
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
    connection.query("SELECT CONCAT_WS(', ', employee.last_name, employee.first_name) AS `Name` FROM employee ORDER by `Name`", (err, results) => {
    inquirer
        .prompt([
            {
                name: 'choice',
                type: 'list',
                choices() {
                    const choiceArray = [];
                    results.forEach(({ Name }) => {
                        choiceArray.push(Name);
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
        });
    })
};

const updateManager  = () => {
    connection.query("SELECT CONCAT_WS(', ', employee.last_name, employee.first_name) AS `Name`, employee.id AS `ID` FROM employee ORDER by `Name`", (err, results) => {
        inquirer
            .prompt([
                {
                    name: 'choice',
                    type: 'list',
                    choices() {
                        const choiceArray = [];
                        results.forEach(({ Name, ID }) => {
                            choiceArray.push(`${Name}, ${ID}`);
                        });
                        return choiceArray;
                    },
                    message: 'Update role for which employee?',
                },
                {name: 'newManager',
                    type: 'list',
                    choices() {
                        const choiceArray = [];
                        results.forEach(({ Name, ID }) => {
                            choiceArray.push(`${Name}, ${ID}`);
                        });
                        return choiceArray;
                    },
                    message: 'Who would you like their new manager to be?',
                }
            ])
            .then((answer) => {
                let ansArrayChoice = answer.choice.split(', ')
                let ansArrayManager = answer.newManager.split(', ')
                const query = connection.query(
                    'UPDATE employee SET ? WHERE ?', 
                    [
                        {
                            manager_id: ansArrayManager[2]
                        },
                        {
                            id: ansArrayChoice[2]
                        },
                    ], 
                    (err, res) => {
                        if (err) throw err;
                        init();
                    }
                );
            });
    })
};

const viewCategory = () => {
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

const addCategory = () => {
    inquirer
        .prompt({
            name: "add_type",
            type: "list",
            message: "What category would you like to add?",
            choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "CANCEL"]
        })
        .then((answer) => {
            if (answer.add_type === "DEPARTMENT") {
                addQuery (answer, deptPrompt);
            } 
            else if (answer.add_type === "ROLE") {
                addQuery (answer, rolePrompt);
            } 
            else if (answer.add_type === "EMPLOYEE") {
                addQuery (answer, emplPrompt);
            } 
            else {
                connection.end();
            }
        });
};

const addQuery = (answer, categoryPrompt) => {
    const categoryAns = answer.add_type;
    let setObj = []
    inquirer.prompt(categoryPrompt)
    .then((answer) => {
        if (categoryAns === "DEPARTMENT") {
            setObj = {
                id: answer.dept_id,
                name: answer.dept_name
            }
        } 
        else if (categoryAns === "ROLE") {
            setObj = {
                id: answer.role_id,
                title: answer.role_title,
                salary: answer.salary,
                department_id: answer.dept_id
            }
        } 
        else if (categoryAns === "EMPLOYEE") {
            setObj = {
                id: answer.role_id,
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.role_id,
                manager_id: answer.manager
            }
        } 
        connection.query(
            "INSERT INTO " + categoryAns + " SET ?",
            setObj,
            (err) => {
                if (err) throw err;
                console.log(`${categoryAns} CREATED SUCESSFULLY.`);
                init();
            }
        );
    });
};

connection.connect((err) => {
    if (err) throw err;
    init ()
});
