import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async(req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        const token = authHeader ? authHeader.replace('Bearer ', '') : null;

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Token is not valid' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const requireGarageOwner = (req, res, next) => {
    if (req.user.userType !== 'garage_owner') {
        return res.status(403).json({ message: 'Access denied. Garage owners only.' });
    }
    next();
};

export { auth, requireGarageOwner };