const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// 1. GET: Fetch all grading results (Lecturers can see all, Students only see their own)
router.get('/', verifyToken, (req, res) => {
    let sql = 'SELECT r.*, u.name as student_name, c.course_name FROM results r JOIN users u ON r.student_id = u.user_id JOIN courses c ON r.course_id = c.course_id';
    const params = [];

    if (req.user.role === 'Student') {
        sql += ' WHERE r.student_id = ?';
        params.push(req.user.user_id);
    }

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: "Database exception error." });
        res.status(200).json(results);
    });
});

// 2. POST: Input student marks (Lecturer Only)
router.post('/', verifyToken, authorizeRoles('Lecturer'), (req, res) => {
    const { student_id, course_id, grade_point, grade_letter } = req.body;

    if (!student_id || !course_id || !grade_point || !grade_letter) {
        return res.status(400).json({ error: "Missing required grading fields." });
    }

    const sql = 'INSERT INTO results (student_id, course_id, grade_point, grade_letter) VALUES (?, ?, ?, ?)';
    db.query(sql, [student_id, course_id, grade_point, grade_letter], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Student marks successfully recorded!" });
    });
});

module.exports = router;
