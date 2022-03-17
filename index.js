const inquirer = require('inquirer');
const express = require('express');
// const cTable = require('console.table');

// Import and require mysql2
const mysql = require('mysql2');

//const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'WellyisC00l!',
        database: 'team_db'

    },
    console.log(`Connected to the team_db database.`)
);


/////////////PROMPTS START/////////////


const promptInit = () => {
    return inquirer.prompt(
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'type',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update employee role', 'Quit']
        }
    )
        .then(({ type }) => {
            if (type === 'View all departments') {
                return viewDepartments();
            } else if (type === 'View all roles') {
                return viewRoles();
            } else if (type === 'View all employees') {
                return viewEmployees();
            } else if (type === 'Add a department') {
                return addDepartment();
            } else if (type === 'Add a role') {
                return addRole();
            } else if (type === 'Add an employee') {
                return addEmployee();
            } else if (type === 'Update employee role') {
                return updateEmployeeRole();
            } else if (type === 'Quit') {
                return;
            }
        });
};

promptInit()


/////////////Renders Tables/////////////


const viewDepartments = () => {
    // Query database
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results)
        return promptInit();
    });
    // Default response for any other request (Not Found)
    app.use((req, res) => {
        res.status(404).end();
    });
};

const viewRoles = () => {
    const sql = `SELECT title, department_id, department_name, salary FROM roles
                LEFT JOIN department ON roles.department_id = department.id`;

    // Query database
    db.query(sql, function (err, results) {
        console.table(results)
        return promptInit();
    });
    // Default response for any other request (Not Found)
    app.use((req, res) => {
        res.status(404).end();
    });
};

const viewEmployees = () => {
    const sql = `SELECT employee.id, first_name, last_name, title, department_name, salary, manager_id FROM employee
                LEFT JOIN roles ON employee.role_id = roles.id
                LEFT JOIN department ON roles.department_id = department.id`;

    // Query database
    db.query(sql, function (err, results) {
        console.table(results)
        return promptInit();
    });
    // Default response for any other request (Not Found)
    app.use((req, res) => {
        res.status(404).end();
    });
};

const addDepartment = () => {

    inquirer.prompt(
        {
            type: 'input',
            name: 'departmentInput',
            message: 'Enter the name of a new department',
            validate: titleInput => {
                if (titleInput) {
                    return true;
                } else {
                    console.log('Please enter a department!');
                    return false;
                }
            }
        }
    )
        .then(({ departmentInput }) => {

            const sql = `INSERT INTO department (department_name) VALUES (?)`
            const params = [departmentInput]
            // Query database
            db.query(sql, params, function (err, results) {
                //console.table(results)
                return promptInit();
            });
            // Default response for any other request (Not Found)
            app.use((req, res) => {
                res.status(404).end();
            });
        });
};

const addRole = () => {

    let deptSql = `SELECT * FROM department`;
    db.query(deptSql, (err, response) => {
        let deptArr = [];
        response.forEach((department) => { deptArr.push(`${department.department_name}`); });



        inquirer.prompt(
            [{
                type: 'input',
                name: 'titleInput',
                message: 'Enter the name of a new role',
                validate: titleInput => {
                    if (titleInput) {
                        return true;
                    } else {
                        console.log('Please enter a new role!');
                        return false;
                    }
                }
            },
            {
                type: 'number',
                name: 'salaryInput',
                message: 'Enter the salary for the new role',
                validate: titleInput => {
                    if (titleInput) {
                        return true;
                    } else {
                        console.log('Please enter a salary!');
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'departmentChoice',
                message: 'Which department is this role affiliated',
                choices: deptArr

            }]
        )
            .then(({ titleInput, salaryInput, departmentChoice }) => {

                let deptId;
                response.forEach((department) => {
                    if (
                        departmentChoice === department.department_name
                    ) {
                        deptId = department.id;
                    }

                });

                const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`
                const params = [titleInput, salaryInput, deptId]
                // Query database
                db.query(sql, params, function (err, results) {
                    //console.table(results)
                    return promptInit();
                });
                // Default response for any other request (Not Found)
                app.use((req, res) => {
                    res.status(404).end();
                });
            });
    })
};


const addEmployee = () => {

    let empSql = `SELECT * FROM employee LEFT JOIN roles ON employee.role_id = roles.id`;
    db.query(empSql, (err, response) => {
        let managerArr = response.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        let rolesArr = [];
        response.forEach((roles) => { rolesArr.push(`${roles.title}`); });

        //let rolesArr = response.map(({ id, title,  }) => ({ name: title + " ", value: id }));

        inquirer.prompt(
            [{
                type: 'input',
                name: 'fNameInput',
                message: 'Enter first name of the new employee',
                validate: titleInput => {
                    if (titleInput) {
                        return true;
                    } else {
                        console.log('Please enter a first name!');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'lNameInput',
                message: 'Enter last name of the new employee',
                validate: titleInput => {
                    if (titleInput) {
                        return true;
                    } else {
                        console.log('Please enter a last name!');
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'roleChoice',
                message: 'Select a role for the employee',
                choices: rolesArr
            },
            {
                type: 'confirm',
                name: 'confirmManager',
                message: 'Does this employee have a manager?',
                default: true
            },
            {
                type: 'list',
                name: 'managerChoice',
                message: 'Select a manager for the employee',
                choices: managerArr,
                when: ({ confirmManager }) => {
                    if (confirmManager) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }]
        )
            .then(({ fNameInput, lNameInput, roleChoice, managerChoice }) => {

                let rolesId;
                response.forEach((roles) => {
                    if (
                        roleChoice === roles.title
                    ) {
                        rolesId = roles.id;
                    }
                });

                let manId;
                response.forEach((employee) => {
                    if (
                        managerChoice === employee.manager_id
                    ) {
                        manId = employee.id;
                    }
                });

                const employeeSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`
                const params = [fNameInput, lNameInput, rolesId, manId]
                // Query database
                db.query(employeeSql, params, function (err, results) {
                    //console.table(results)
                    return promptInit();
                });
                // Default response for any other request (Not Found)
                app.use((req, res) => {
                    res.status(404).end();
                });
            });
    })
};

const updateEmployeeRole = () => {
    let empSql = `SELECT * FROM employee`;

    db.query(empSql, (err, response) => {
        let employeeArr = [];
        response.forEach((employee) => { employeeArr.push(`${employee.first_name} ${employee.last_name}`); });

        inquirer.prompt(
            {
                type: 'list',
                name: 'employeeChoice',
                message: 'Select an employee you which to update',
                choices: employeeArr
            }

        )
            .then((answer) => {

                let employeeId;
                response.forEach((employee) => {
                    if (
                        answer.employeeChoice === `${employee.first_name} ${employee.last_name}`
                    ) {
                        employeeId = employee.id;
                    }

                });

                const sql = `Update employee SET employee.role_id = ? WHERE employee.id = ?`
                const params = [employeeId]
                // Query database
                db.query(sql, params, function (err, results) {
                    //console.table(results)
                    return askRole(employeeId);
                });
                // Default response for any other request (Not Found)
                app.use((req, res) => {
                    res.status(404).end();
                });
            });
    })

};

const askRole = (employeeId) => {
    let roleSql = `SELECT * FROM roles`;

    db.query(roleSql, (err, response) => {
        let rolesArr = [];
        response.forEach((roles) => { rolesArr.push(`${roles.title}`); });


        inquirer.prompt(
            {
                type: 'list',
                name: 'roleUpdate',
                message: 'Select an new role',
                choices: rolesArr
            }

        )
            .then((answer) => {
                let rolesId;
                response.forEach((roles) => {
                    if (
                        answer.roleUpdate === roles.title
                    ) {
                        rolesId = roles.id;
                    }

                });

                const sql = `Update employee SET employee.role_id = ? WHERE employee.id = ?`
                const params = [rolesId, employeeId]
                // Query database
                db.query(sql, params, function (err, results) {
                    //console.table(results)
                    return promptInit();
                });
                // Default response for any other request (Not Found)
                app.use((req, res) => {
                    res.status(404).end();
                });
            });
    })

};