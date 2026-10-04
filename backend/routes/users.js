const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// 1. GET: Fetch all Lecturers and Students across the system (Admin Only)
router.get('/', verifyToken, authorizeRoles('Administrator'), (req, res) => {
    const sql = "SELECT user_id, name, email, role, created_at FROM users WHERE role IN ('Lecturer', 'Student')";
    
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to retrieve system user index registers." });
        res.status(200).json(results);
    });
});

// 2. PUT: Update an existing user's profile details (Admin Only)
router.put('/:id', verifyToken, authorizeRoles('Administrator'), (req, res) => {
    const { name, email, role } = req.body;
    const userId = req.params.id;

    if (!name || !email || !role) {
        return res.status(400).json({ error: "Payload verification failed. Missing updating attributes." });
    }

    const sql = "UPDATE users SET name = ?, email = ?, role = ? WHERE user_id = ? AND role IN ('Lecturer', 'Student')";
    
    db.query(sql, [name, email, role, userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Target user not found or unauthorized modification tier." });
        res.status(200).json({ message: "User credentials and access role updated successfully." });
    });
});

module.exports = router;
