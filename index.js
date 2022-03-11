const inquirer = require('inquirer');
const express = require('express');
// const cTable = require('console.table');
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'WellyisC00l!',
        database: 'inventory_db'
    },
    console.log(`Connected to the inventory_db database.`)
);


/////////////PROMPTS START/////////////


const promptInit = () => {
    return inquirer.prompt(
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'type',
            choices: ['View all employees', 'View all employees by department', 'View all employees by manager', 'Add employee', 'Remove Employee', 'Update employee role', 'Update employee manager', 'Quit']
        }
    )
        .then(({ type }) => {
            if (type === 'View all employees') {
                viewEmployees()  
                                         
            } else if (type === 'View all employees by department') {
                return viewEmployeesByDept();
            } else if (type === 'Quit') {
                return;
            }
        });
};

promptInit()


/////////////Renders Tables/////////////


const viewEmployees = () => {

    
    // Query database
    db.query('SELECT * FROM books', function (err, results) {
        console.table(results)
        return promptInit(); 
    });
    

    // Default response for any other request (Not Found)
    app.use((req, res) => {
        res.status(404).end();
    });
    
    
    
};