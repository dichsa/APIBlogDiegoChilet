const express = require('express');
const mysql = require('mysql2')
const app = express();

const conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Diego1234',
    database:'restaurantediego'
});

conexion.connect((error) => {
    if(error) {
        console.log('Error connecting to database:', error);
        return;
    }
    console.log('Connected to database!');
});

app.get('/', function (req, res) {
    res.send('Hoa, mundo!');
  });

app.listen(3000, function () {
    console.log('La aplicación está escuchando en el puerto 3000!');
  });