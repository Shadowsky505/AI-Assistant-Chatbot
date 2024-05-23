// backend/index.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Importar la biblioteca jsonwebtoken

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'automotive_chatbot'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Función para generar un token JWT
function generateToken(email) {
  return jwt.sign({ email: email }, 'secret_key', { expiresIn: '1h' });
}

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  
  // Verificar si el correo ya existe
  const checkEmailQuery = 'SELECT email FROM users WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length > 0) {
      return res.status(400).send({ message: 'Email already registered' });
    }
    
    // Si el correo no existe, insertar el nuevo usuario
    const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(insertQuery, [username, email, password], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      // Generar un token JWT
      const token = generateToken(email);
      // Devolver el token en la respuesta de registro
      res.send({ message: 'User registered successfully!', token: token });
    });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length > 0) {
      // Generar un token JWT
      const token = generateToken(email);
      // Devolver el token en la respuesta de inicio de sesión
      res.send({ message: 'Login successful!', token: token });
    } else {
      res.status(401).send({ message: 'Invalid credentials' });
    }
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
