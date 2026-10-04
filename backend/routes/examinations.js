const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Your MySQL pool connection instance
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// 1. GET: Fetch exams with simple search/filtering capabilities
router.get('/', verifyToken, (req, res) => {
    let sql = 'SELECT * FROM examinations';
    const params = [];

    if (req.query.venue) {
        sql += ' WHERE venue = ?';
        params.push(req.query.venue);
    }

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: "Database exception error occurred." });
        res.status(200).json(results);
    });
});

// 2. POST: Create a new examination schedule (Admin Only)
router.post('/', verifyToken, authorizeRoles('Administrator'), (req, res) => {
    const { course_id, exam_date, start_time, venue } = req.body;

    // Direct Input Data Validation
    if (!course_id || !exam_date || !start_time || !venue) {
        return res.status(400).json({ error: "Payload verification failed. Missing fields." });
    }

    const sql = 'INSERT INTO examinations (course_id, exam_date, start_time, venue) VALUES (?, ?, ?, ?)';
    db.query(sql, [course_id, exam_date, start_time, venue], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Exam scheduled successfully", exam_id: result.insertId });
    });
});

// 3. PUT: Update an existing exam schedule (Admin Only)
router.put('/:id', verifyToken, authorizeRoles('Administrator'), (req, res) => {
    const { venue, exam_date } = req.body;
    const sql = 'UPDATE examinations SET venue = ?, exam_date = ? WHERE exam_id = ?';

    db.query(sql, [venue, exam_date, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Exam ID target not found." });
        res.status(200).json({ message: "Exam parameters updated successfully." });
    });
});

// 4. DELETE: Remove an existing exam schedule (Admin Only)
router.delete('/:id', verifyToken, authorizeRoles('Administrator'), (req, res) => {
    const sql = 'DELETE FROM examinations WHERE exam_id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Exam record missing." });
        res.status(200).json({ message: "Exam scheduled item successfully purged." });
    });
});

module.exports = router;
