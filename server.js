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

app.get('/', (req, res) => {

    // Create a department
    // const sql = `INSERT INTO departments (id, department_name)
    //               VALUES(?,?)`;
    // const params = [1, 'Administration/Operations'];

    // db.query(sql, params, (err, result) => {
    //     if(err) {
    //         console.log(err);
    //     }
    //     console.log(result);
    // });

    res.json({
        message: 'Hello World'
    });
});

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server is running @ http://localhost:${PORT}`);
});