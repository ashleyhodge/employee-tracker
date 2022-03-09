const express = require('express');
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
        user: 'root',
        password: '',
        database: 'business'
    },
    console.log('Connected to the business database.')
);
// View all departments
app.get('/api/departments', (req, res) => {
    const sql = `SELECT * FROM departments`;

    db.query(sql, (err, rows) => {
        if(err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});
// Delete a department
app.delete('/api/department/:id', (req, res) => {
    const sql = `DELETE FROM departments WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if(err) {
            res.statusMessage(400).json({ error: err.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Department not found'
            });
        } else {
            res.json({
                mesage: 'Department has been successfully deleted!',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

//Create a department
app.post('/api/department', ({ body }, res) => {
    const sql = `INSERT INTO departments (department_name)
                   VALUES(?)`;
    const params = [body.department_name];

    db.query(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({ error: err.message });
            return;
        } 
        res.json({
            message: 'Department successfully created!',
            data: body
        });
    });
});
// View all roles 
app.get('/api/roles', (req, res) => {
    const sql = `SELECT roles.*, departments.department_name AS department_name 
                    FROM roles 
                    LEFT JOIN departments ON roles.department_id = departments.id;`;

    db.query(sql, (err, rows) => {
        if(err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

app.delete('/api/role/:id', (req, res) => {
    const sql = `DELETE FROM roles WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({ error: err.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Role not found'
            });
        } else {
            res.json({
                message: 'Role has been successfully deleted!',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});
app.post('/api/role', ({ body }, res) => {
    const sql = `INSERT INTO roles (title, salary, department_id)
                   VALUES(?,?,?)`;
    const params = [body.title, body.salary, body.department_id];

    db.query(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({ error: err.message });
            return;
        } 
        res.json({
            message: 'Role successfully created!',
            data: body
        });
    });
});
// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server is running @ http://localhost:${PORT}`);
});