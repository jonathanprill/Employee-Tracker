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
    // Query database
    db.query('SELECT * FROM roles', function (err, results) {
        console.table(results)
        return promptInit(); 
    });
    // Default response for any other request (Not Found)
    app.use((req, res) => {
        res.status(404).end();
    });
};

const viewEmployees = () => {
    // Query database
    db.query('SELECT * FROM employee', function (err, results) {
        console.table(results)
        return promptInit(); 
    });
    // Default response for any other request (Not Found)
    app.use((req, res) => {
        res.status(404).end();
    });
};

const addDepartment = () => {
    // Query database
    db.query(`INSERT INTO department (department_name)
         VALUES ('Technical')`, function (err, results) {
        //console.table(results)
        return promptInit(); 
    });
    // Default response for any other request (Not Found)
    app.use((req, res) => {
        res.status(404).end();
    });
};

const addRole = () => {
    // Query database
    db.query(`INSERT INTO roles (title, salary, department_id)
         VALUES ('Intern', 150, 2)`, function (err, results) {
        //console.table(results)
        return promptInit(); 
    });
    // Default response for any other request (Not Found)
    app.use((req, res) => {
        res.status(404).end();
    });
};

const addEmployee = () => {
    // Query database
    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
         VALUES ('Anthony', 'Soprano', 1, 2)`, function (err, results) {
        //console.table(results)
        return promptInit(); 
    });
    // Default response for any other request (Not Found)
    app.use((req, res) => {
        res.status(404).end();
    });
};