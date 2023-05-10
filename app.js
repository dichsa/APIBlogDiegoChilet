const express = require('express');
const bodyparser = require('body-parser')
const mysql = require('mysql2')
const app = express();

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

const conexion = mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'Diego1234',
    database:'blog'
});

conexion.connect((error) => {
    if(error) {
        console.log('Error connecting to database:', error);
        return;
    }
    console.log('Connected to database!');
});

// Obtener todos los posts
app.get('/api/posts', (req, res) => {
    const sql = 'SELECT *,  autores.nombre AS autor_nombre, autores.email AS autor_email, autores.imagen AS autor_imagen FROM posts JOIN autores ON posts.id_autor';

    //, autores.nombre, autores.email, autores.imagen  JOIN autores ON posts.id_autor

    conexion.query(sql, (error, results) => {
        if(error) {
            console.log('Error retrieving posts:', error);
            res.status(500).json({ message: 'Error retrieving posts' });
            return;
        }
        res.status(200).json({ posts: results });
    });
});


// Creación de un post
app.post('/api/posts', (req, res) => {
    const { titulo, descripcion, categoria, id_autor } = req.body;

    const sql = 'INSERT INTO posts (titulo, descripcion, categoria, id_autor) VALUES (?, ?, ?, ?);'

    conexion.query(sql, [titulo, descripcion, categoria, id_autor], (error, result) => {
        if (error) {
            console.log('Error creating post:', error);
            res.status(500).json({ message: 'Error creating post' });
            return;
        }

        const newPost = { id: result.insertId, titulo, descripcion, categoria, id_autor };
        res.status(201).json({ post: newPost });
    });
});

// Obtener un post por su id
app.get('/api/posts/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'SELECT posts.*, autores.nombre AS autor_nombre, autores.email AS autor_email, autores.imagen AS autor_imagen FROM posts JOIN autores ON posts.id_autor = autores.id_autor WHERE posts.id_post = ?';


    conexion.query(sql, [id], (error, results) => {
        if(error) {
            console.log('Error retireving post:', error);
            res.status(500).json({ message: 'Error retrieving post' });
            return;
        }

        if(results.length === 0) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }

        res.status(200).json({ post: results[0] });
    });
});

app.listen(3000, function () {
    console.log('La aplicación está escuchando en el puerto 3000!');
  });
