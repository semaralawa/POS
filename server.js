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
                    res.redirect('/home');
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

//homepage
app.get('/home', function (req, res) {
    res.render(path.join(__dirname, 'public/home.ejs'));
});

//show data on database
app.get('/data', function (req, res) {
    connection.query(
        'SELECT * FROM barang',
        (error, results) => {
            res.render(path.join(__dirname, 'public/list.ejs'), { items: results });
        }
    );
});

//add data handler
app.get('/add-data', function (req, res) {
    res.render(path.join(__dirname, 'public/add-data.ejs'));
});

app.post('/add-data', function (req, res) {
    var data = req.body;
    var sql = "INSERT INTO barang SET ?";
    connection.query(sql, [data],
        (error, results) => {
            if (error) throw (error);
            console.log('update successfull');
            res.redirect('/data');
        }
    );
});

//edit data handler
app.get('/edit-data/:id', function (req, res) {
    connection.query(
        'SELECT * FROM barang WHERE id_brg=?', [req.params.id],
        (error, results) => {
            res.render(path.join(__dirname, 'public/edit-data.ejs'), { barangs: results });
        }
    );
});

app.post('/edit-data/:id', function (req, res) {
    var data = req.body;
    var sql = "UPDATE barang SET ? WHERE id_brg= ?";
    connection.query(sql, [data, req.params.id],
        (error, results) => {
            if (error) throw (error);
            console.log('update successfull');
        }
    );
    res.redirect('/data');
});

//delete data handler
app.get('/delete-data/:id', function (req, res) {
    var sql = "DELETE FROM barang WHERE id_brg=?";
    connection.query(sql, [req.params.id],
        (error, results) => {
            if (error) throw (error);
            console.log('delete successfull');
        }
    );
    res.redirect('/data');
});

app.listen(80, '0.0.0.0');