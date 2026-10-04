const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "UPTM_SUPER_SECRET_KEY_2026";

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Please provide both email and password." });
    }

    // Look up user in the database
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database lookup failure." });
        }
        
        // If results array length is 0, email is not found
        if (!results || results.length === 0) {
            return res.status(401).json({ error: "Invalid email profile account." });
        }

        // CRITICAL FIX: Extract the first matching user row object out of the array
        const user = results[0]; 

        // Match plain text strings for your project environment
        if (password !== user.password) {
            return res.status(401).json({ error: "Incorrect security password entry." });
        }

        // Generate tracking token payload safely
        const token = jwt.sign(
            { user_id: user.user_id, name: user.name, role: user.role },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        // Return properties cleanly back to index.html browser
        res.status(200).json({
            message: "Authentication successful",
            token: token,
            user: { id: user.user_id, name: user.name, role: user.role }
        });
    });
});

module.exports = router;
