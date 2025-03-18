const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../Frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/index.html'));
});

app.get('/user.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/user.html'));
});

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql@123',
    database: 'loginpage'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('MySQL connected...');
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Error checking login:', err.message);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        if (results.length > 0) {
            res.json({ message: 'Login successful!' });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    });
});

// Check and release port if already in use
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use. Trying to close it...`);
        const exec = require('child_process').exec;
        exec(`npx kill-port ${PORT}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Failed to free port ${PORT}:`, error.message);
                process.exit(1);
            }
            console.log(`Port ${PORT} freed. Restarting server...`);
            server.listen(PORT);
        });
    } else {
        console.error('Server error:', err);
    }
});
