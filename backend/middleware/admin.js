// middleware/admin.js
import auth from './auth.js';

const admin = async(req, res, next) => {
    try {
        await auth(req, res, () => {});

        if (req.user.userType !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin rights required.' });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

export default admin;