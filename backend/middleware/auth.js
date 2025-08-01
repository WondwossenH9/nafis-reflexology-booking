function adminAuth(req, res, next) {
    const token = req.headers['authorization'];
    if (token === `Bearer ${process.env.ADMIN_PASSWORD}`) {
        next();
    } else {
        res.status(401).json({ success: false, error: 'Unauthorized' });
    }
}

module.exports = adminAuth;
