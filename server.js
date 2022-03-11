const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');


// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'business'
    },
    start()
);

// Start prompt
function start() {
    inquirer.prompt([
        {
        type: 'list',
        message: 'What would you like to do?',
        name: 'start',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Delete a department',
            'Delete a role',
            'Delete an employee',
            "Update an existing employee's role"          
            ]
        }
    ]).then(function(value) {
        switch (value.start) {
            case 'View all departments':
                veiwAllDepartments();
            break;

            case 'View all roles':
                viewAllRoles();
            break;

            case 'View all employees':
                viewAllEmployees();
            break;

            case 'Add a department':
                addDepartment();
            break;

            case 'Add a role':
                addRole();
            break;

            case 'Add an employee':
                addEmployee();
            break;

            case "Update an existing employee's role":
                updateEmployee();
            break;

            case 'Delete a department':
                deleteDepartment();
            break;

            case 'Delete a role':
                deleteRole();
            break;

            case 'Delete an employee':
                deleteEmployee();
            break;
        }
    })
}
// View all departments
function veiwAllDepartments() {
    const sql = `SELECT * FROM departments`;

    db.query(sql, (err, res) => {
        if(err) throw err
        console.table(res)
        start()
    })
}
// View all roles
function viewAllRoles() {
    const sql = `SELECT roles.id, roles.title, roles.salary, departments.department_name AS department_name 
                FROM roles 
                INNER JOIN departments ON roles.department_id = departments.id
                ORDER BY id`;

    db.query(sql, (err, res) => {
        if(err) throw err
        console.table(res)
        start()
    })
}
// View all employees
function viewAllEmployees() {
    const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.department_name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
                FROM employees 
                LEFT JOIN employees manager ON manager.id = employees.manager_id 
                INNER JOIN roles ON (roles.id = employees.role_id) 
                INNER JOIN departments ON (departments.id = roles.department_id) 
                ORDER BY employees.id;`;

    db.query(sql, (err, res) => {
        if(err) throw err
        console.table(res)
        start()
    })
}
// Add a department
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Please enter a new department name:',
            name: 'newDept'
        }
    ]).then(answer => {
        const sql = `INSERT INTO departments (department_name)
                    VALUES(?)`;
        db.query(sql, answer.newDept, (err, res) => {
        if(err) throw err

        veiwAllDepartments();
        });
    });
};
// Add a role
function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Please enter the title of this role:',
            name: 'title'
        },
        {
            type:'input',
            messgae: "Please enter the salary for this role:",
            name: 'salary'
        }
    ]).then(answer => {
        const deptSql = `SELECT department_name, id FROM departments`;
        const params = [answer.title, answer.salary];

        db.query(deptSql, (err, res) => {
            if(err) throw err

            const dept = res.map(({ id, department_name }) => ({ name: department_name, value: id}));

            inquirer.prompt([
                {
                    type: 'list',
                    message: 'Which department does this role belong in?',
                    name: 'dept',
                    choices: dept
                }
            ]).then(deptAnswer => {
                const dept = deptAnswer.dept;
                params.push(dept);

                const sql = `INSERT INTO roles (title, salary, department_id)
                            VALUES(?,?,?)`;

                db.query(sql, params, (err, result) => {
                    if(err) throw err;

                    viewAllRoles();
                })
            })
        })
    })
};
// Add an employee
function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'First name:',
            name: 'first_name'
        },
        {
            type: 'input',
            message: 'Last name:',
            name: 'last_name'
        }
    ]).then(answer => {
        const empSql = `SELECT roles.id, roles.title FROM roles`;
        const params = [answer.first_name, answer.last_name];

        db.query(empSql, params, (err, res) => {
            if(err) throw err;

            const role = res.map(({ id, title }) => ({ name: title, value: id }));

            inquirer.prompt([
                {
                    type: 'list',
                    message: 'Choose a role for this employee:',
                    name: 'role',
                    choices: role
                }
            ]).then(roleAnswer => {
                const role = roleAnswer.role;
                params.push(role);

                const mngtSql = `SELECT * FROM employees`;
                db.query(mngtSql, (err, res) => {
                    if(err) throw err;

                    const manager = res.map(({ id, first_name, last_name }) => ({ name: first_name + ' ' + last_name, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            message: 'Choose a manager for this employee:',
                            name: 'manager',
                            choices: manager
                        }
                    ]).then(mngtAnswer => {
                        const manager = mngtAnswer.manager;
                        params.push(manager);

                        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                                    VALUES(?,?,?,?)`
                        
                        db.query(sql, params, (err, res) => {
                            if(err) throw err

                            viewAllEmployees();
                        })
                    })
                })
            })
        })
    })
}
// Update an existing employee
function updateEmployee() {
    const empSql = `SELECT * FROM employees`;

    db.query(empSql, (err, res) => {
        if(err) throw err;

        const employees = res.map(({ id, first_name, last_name }) => ({ name: first_name + ' ' + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                message: 'Choose existing employee to update:',
                name: 'employee',
                choices: employees
            }
        ]).then(empAnswer => {
            const employee = empAnswer.employee;
            const params = [];
            params.push(employee);

            const roleSql = `SELECT * FROM roles`;

            db.query(roleSql, (err, res) => {
                if(err) throw err;

                const roles = res.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        message: 'Choose the new role for this employee:',
                        name: 'role',
                        choices: roles
                    }
                ]). then(roleAnswer => {
                    const role = roleAnswer.role;
                    params.push(role);

                    let employee = params[0]
                    params[0] = role
                    params[1] = employee

                    const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;

                    db.query(sql, params, (err, res) => {
                        if(err) throw err;

                        viewAllEmployees();
                    })
                })
            })
        })
    })
}
// Delete a department
function deleteDepartment() {
    const deptSql = `SELECT * FROM departments`;

    db.query(deptSql, (err, res) => {
        if(err) throw err;

        const departments = res.map(({ id, department_name}) => ({ name: department_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                message: 'Choose a department to delete:',
                name: 'department',
                choices: departments
            }
        ]).then(deptAnswer => {
            const department = deptAnswer.department;
            const sql = `DELETE FROM departments WHERE id = ?`;

            db.query(sql,  department, (err, res) => {
                if(err) throw err;

                veiwAllDepartments();
            })
        }) 
    })
}
// Delete a role
function deleteRole() {
    const roleSql = `SELECT * FROM roles`;

    db.query(roleSql, (err, res) => {
        if(err) throw err;

        const roles = res.map(({ id, title }) => ({ name: title, value: id }));

        inquirer.prompt([
            { 
                type: 'list',
                message: 'Choose a role to delete:',
                name: 'role',
                choices: roles
            }
        ]).then(roleAnswer => {
            const role = roleAnswer.role;
            const sql = `DELETE FROM roles WHERE id = ?`;

            db.query(sql, role, (err, res) => {
                if(err) throw err;

                viewAllRoles();
            })
        })
    })
}    
function deleteEmployee() {
    const empSql = `SELECT * FROM employees`;

    db.query(empSql, (err, res) => {
        if(err) throw err;

        const employees = res.map(({ id, first_name, last_name }) => ({ name: first_name + ' ' + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                message: 'Chose an amployee to delete:',
                name: 'employee',
                choices: employees
            }
        ]).then(empAnswer => {
            const employee = empAnswer.employee;
            const sql = `DELETE FROM employees WHERE id = ?`;

            db.query(sql, employee, (err, res) => {
                if(err) throw err;

                viewAllEmployees();
            })
        })
    })
}

