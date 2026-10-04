const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.get('/download-slip', verifyToken, authorizeRoles('Student'), (req, res) => {
    const doc = new PDFDocument();
    
    // Set headers to trigger a direct download in the browser
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Exam_Slip_${req.user.user_id}.pdf`);
    
    doc.pipe(res);
    
    // Design and structure the generated PDF document
    doc.fontSize(20).text('UNIVERSITI POLY-TECH MALAYSIA', { align: 'center' });
    doc.fontSize(14).text('OFFICIAL EXAMINATION SLIP - JULY 2026', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12).text(`Authorized Student ID Reference: UPTM-2026-${req.user.user_id}`);
    doc.text(`Authorized Student Name Account: ${req.user.name || 'Enrolled Student Account'}`);
    doc.moveDown();
    
    doc.text('Registered Examination Schedules:', { underline: true });
    doc.text('- SWC3633 Web API Development | Date: 2026-10-12 | Time: 09:00 AM | Venue: Dewan Tan Sri Sanusi Junid');
    
    doc.end();
});

module.exports = router;
