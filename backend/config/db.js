const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',          // Default XAMPP username
    password: '',          // Default XAMPP password is completely empty text
    database: 'exam_management', // <--- Make sure this matches your phpMyAdmin DB name exactly!
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
