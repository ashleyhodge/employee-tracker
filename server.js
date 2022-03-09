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

app.get('/', (req, res) => {

    db.query(`SELECT * FROM departments`, (err, rows) => {
        console.log(rows);
    })
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