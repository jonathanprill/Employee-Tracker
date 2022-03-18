const inquirer = require('inquirer');
const express = require('express');
// const cTable = require('console.table');

// Import and require mysql2
const mysql = require('mysql2');

//const PORT = process.env.PORT || 3001;
const app = express();



// Starter Title
const CFonts = require('cfonts');
CFonts.say('Police|Database', {
	font: 'pallet',              // define the font face
	align: 'left',              // define text alignment
	colors: ['blue'],         // define all colors
	background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
	letterSpacing: 1,           // define letter spacing
	lineHeight: 1,              // define the line height
	space: true,                // define if the output text should have empty lines on top and on the bottom
	maxLength: '0',             // define how many character can be on one line
	gradient: false,            // define your two gradient colors
	independentGradient: false, // define if you want to recalculate the gradient for each new line
	transitionGradient: false,  // define if this is a transition between colors directly
	env: 'node'                 // define the environment CFonts is being executed in
});

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'WellyisC00l!',
        database: 'police_db'

    },
    console.log(`Connected to the police_db database.`)
);


/////////////PROMPTS START/////////////


const promptInit = () => {
    return inquirer.prompt(
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'type',
            choices: ['View all crews', 'View all roles', 'View all suspects', 'Add a crew', 'Add a role', 'Add an suspect', 'Update suspect role', 'Quit']
        }
    )
        .then(({ type }) => {
            if (type === 'View all crews') {
                return viewCrews();
            } else if (type === 'View all roles') {
                return viewRoles();
            } else if (type === 'View all suspects') {
                return viewSuspect();
            } else if (type === 'Add a crew') {
                return addCrew();
            } else if (type === 'Add a role') {
                return addRole();
            } else if (type === 'Add an suspect') {
                return addSuspect();
            } else if (type === 'Update suspect role') {
                return updatesuspectRole();
            } else if (type === 'Quit') {
                return;
            }
        });
};

promptInit()


/////////////Renders Tables/////////////
const viewCrews = () => {
    // Query database
    db.query('SELECT * FROM crew', function (err, results) {
        console.table(results)
        return promptInit();
    });
    // Default response for any other request (Not Found)
    app.use((req, res) => {
        res.status(404).end();
    });
};


const viewRoles = () => {
    const sql = `SELECT title, crew_id, crew_name, salary FROM roles
                LEFT JOIN crew ON roles.crew_id = crew.id`;

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

const viewSuspect = () => {
    const sql = `SELECT suspect.id, first_name, last_name, title, crew_name, salary, manager_id FROM suspect
                LEFT JOIN roles ON suspect.role_id = roles.id
                LEFT JOIN crew ON roles.crew_id = crew.id`;

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
/////////////Insert to Table/////////////
const addCrew = () => {

    inquirer.prompt(
        {
            type: 'input',
            name: 'crewInput',
            message: 'Enter the name of a new crew',
            validate: titleInput => {
                if (titleInput) {
                    return true;
                } else {
                    console.log('Please enter a crew!');
                    return false;
                }
            }
        }
    )
        .then(({ crewInput }) => {

            const sql = `INSERT INTO crew (crew_name) VALUES (?)`
            const params = [crewInput]
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

/////////////Insert to Table/////////////
const addRole = () => {

    let deptSql = `SELECT * FROM crew`;
    db.query(deptSql, (err, response) => {
        let deptArr = [];
        response.forEach((crew) => { deptArr.push(`${crew.crew_name}`); });



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
                name: 'crewChoice',
                message: 'Which crew is this role affiliated',
                choices: deptArr

            }]
        )
            .then(({ titleInput, salaryInput, crewChoice }) => {

                let deptId;
                response.forEach((crew) => {
                    if (
                        crewChoice === crew.crew_name
                    ) {
                        deptId = crew.id;
                    }

                });

                const sql = `INSERT INTO roles (title, salary, crew_id) VALUES (?, ?, ?)`
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

/////////////Insert to Table/////////////
//ADD suspect
const addSuspect = () => {

    let empSql = `SELECT * FROM suspect LEFT JOIN roles ON suspect.role_id = roles.id`;
    db.query(empSql, (err, response) => {
        let managerArr = response.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        let rolesArr = [];
        response.forEach((roles) => { rolesArr.push(`${roles.title}`); });

        //let rolesArr = response.map(({ id, title,  }) => ({ name: title + " ", value: id }));

        inquirer.prompt(
            [{
                type: 'input',
                name: 'fNameInput',
                message: 'Enter first name of the new suspect',
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
                message: 'Enter last name of the new suspect',
                validate: titleInput => {
                    if (titleInput) {
                        return true;
                    } else {
                        console.log('Please enter a last name!');
                        return false;
                    }
                }
            }]
        )
            .then(({ fNameInput, lNameInput }) => {


                return addSuspectRole(fNameInput, lNameInput);
            });
    })
};

// ADD suspect CONTINUED
const addSuspectRole = (fNameInput, lNameInput) => {

    let empSql = `SELECT * FROM roles`;
    db.query(empSql, (err, response) => {
        
        let rolesArr = [];
        response.forEach((roles) => { rolesArr.push(`${roles.title}`); });

        //let rolesArr = response.map(({ id, title,  }) => ({ name: title + " ", value: id }));

        inquirer.prompt(
            
            {
                type: 'list',
                name: 'roleChoice',
                message: 'Select a role for the suspect',
                choices: rolesArr
            }
        )
            .then((answer) => {

                let rolesId;
                response.forEach((roles) => {
                    if (
                        answer.roleChoice === roles.title
                    ) {
                        rolesId = roles.id;
                    }
                });

                

                return addSuspectManager(fNameInput, lNameInput, rolesId);
            });
    })
};


// ADD suspect CONTINUED...
const addSuspectManager = (fNameInput, lNameInput, rolesId) => {

    let empSql = `SELECT * FROM suspect`;
    db.query(empSql, (err, response) => {
        
        let managerArr = response.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
        

        inquirer.prompt(
            
            [{
                type: 'confirm',
                name: 'confirmManager',
                message: 'Does this suspect have a manager?',
                default: true
            },
            {
                type: 'list',
                name: 'managerChoice',
                message: 'Select a manager for the suspect',
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
            .then((answer) => {

                let manId;
                response.forEach((suspect) => {
                    if (
                        answer.managerChoice === suspect.manager_id
                    ) {
                        manId = suspect.id;
                    }
                });
                

                const suspectSql = `INSERT INTO suspect (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`
                const params = [fNameInput, lNameInput, rolesId, manId]
                // Query database
                db.query(suspectSql, params, function (err, results) {
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

//UPDATE  ROLE
const updatesuspectRole = () => {
    let empSql = `SELECT * FROM suspect`;

    db.query(empSql, (err, response) => {
        let suspectArr = [];
        response.forEach((suspect) => { suspectArr.push(`${suspect.first_name} ${suspect.last_name}`); });

        inquirer.prompt(
            {
                type: 'list',
                name: 'suspectChoice',
                message: 'Select an suspect you which to update',
                choices: suspectArr
            }

        )
            .then((answer) => {

                let suspectId;
                response.forEach((suspect) => {
                    if (
                        answer.suspectChoice === `${suspect.first_name} ${suspect.last_name}`
                    ) {
                        suspectId = suspect.id;
                    }

                });

                const sql = `Update suspect SET suspect.role_id = ? WHERE suspect.id = ?`
                const params = [suspectId]
                // Query database
                db.query(sql, params, function (err, results) {
                    //console.table(results)
                    return askRole(suspectId);
                });
                // Default response for any other request (Not Found)
                app.use((req, res) => {
                    res.status(404).end();
                });
            });
    })

};

//UPDATE  ROLE CONTINUED
const askRole = (suspectId) => {
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

                const sql = `Update suspect SET suspect.role_id = ? WHERE suspect.id = ?`
                const params = [rolesId, suspectId]
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