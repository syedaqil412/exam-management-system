const jwt = require('jsonwebtoken');
const JWT_SECRET = "UPTM_SUPER_SECRET_KEY_2026";

// Verify Token Validity
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Grab the token string after 'Bearer'

    if (!token) return res.status(401).json({ error: "Access denied. Token missing." });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified; 
        next();
    } catch (err) {
        res.status(403).json({ error: "Invalid or expired token." });
    }
};

// Role-Based Authorization Engine
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden: Unauthorized access level." });
        }
        next();
    };
};

module.exports = { verifyToken, authorizeRoles };

