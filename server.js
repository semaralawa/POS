const express = require('express');
const mysql = require('mysql');
const path = require('path');

//create connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pos'
});

connection.connect();

//set up express
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.redirect('/login');
});

//login page handler
app.get('/login', function (req, res) {
    res.render(path.join(__dirname, 'public/login.ejs'));
});

app.post('/login', function (req, res) {
    const user = req.body.username;
    connection.query(
        'SELECT * FROM admin WHERE username = ?',
        [user],
        (error, results) => {
            if (results.length > 0) {
                if (req.body.password === results[0].password) {
                    res.redirect('/show-data');
                } else {
                    console.log("wrong password");
                    res.redirect('/');
                }
            } else {
                console.log("invalid username");
                res.redirect('/');
            }
        }
    );
});

//show data on database
app.get('/show-data', function (req, res) {
    connection.query(
        'SELECT * FROM mahasiswa',
        (error, results) => {
            res.render(path.join(__dirname, 'public/list.ejs'), { students: results });
        }
    );
});

app.listen(80, '0.0.0.0');