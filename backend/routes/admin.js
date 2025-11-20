// routes/admin.js
import express from 'express';
import Booking from '../models/Booking.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Garage from '../models/Garage.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get admin dashboard stats
router.get('/dashboard-stats', auth, async(req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const totalBookings = await Booking.countDocuments();
        const pendingBookings = await Booking.countDocuments({ status: 'pending' });
        const completedBookings = await Booking.countDocuments({ status: 'completed' });
        const totalUsers = await User.countDocuments({ userType: 'customer' });
        const totalGarages = await Garage.countDocuments();
        const totalRevenue = await Booking.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const recentBookings = await Booking.find()
            .populate('user', 'name email phone')
            .populate('garage', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            stats: {
                totalBookings,
                pendingBookings,
                completedBookings,
                totalUsers,
                totalGarages,
                totalRevenue: totalRevenue[0] ? .total || 0
            },
            recentBookings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all bookings with filters
router.get('/bookings', auth, async(req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { status, page = 1, limit = 10 } = req.query;
        const filter = status ? { status } : {};

        const bookings = await Booking.find(filter)
            .populate('user', 'name email phone')
            .populate('garage', 'name location')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Booking.countDocuments(filter);

        res.json({
            bookings,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update booking status
router.put('/bookings/:id/status', auth, async(req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { status, adminNotes, assignedMechanic, estimatedCompletion } = req.body;

        const booking = await Booking.findByIdAndUpdate(
                req.params.id, {
                    status,
                    adminNotes,
                    assignedMechanic,
                    estimatedCompletion,
                    ...(status === 'completed' && { actualCompletion: new Date() })
                }, { new: true }
            ).populate('user', 'name email phone')
            .populate('garage', 'name');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all messages (admin view)
router.get('/messages', auth, async(req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const messages = await Message.find()
            .populate('sender', 'name email userType')
            .populate('receiver', 'name email userType')
            .sort({ createdAt: -1 });

        // Group messages by conversation
        const conversations = {};
        messages.forEach(message => {
            const convId = message.conversationId;
            if (!conversations[convId]) {
                conversations[convId] = [];
            }
            conversations[convId].push(message);
        });

        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin reply to message
router.post('/messages/reply', auth, async(req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { conversationId, receiverId, message } = req.body;

        const newMessage = new Message({
            conversationId,
            sender: req.user.id,
            receiver: receiverId,
            message,
            isAdminReply: true
        });

        await newMessage.save();

        const populatedMessage = await Message.findById(newMessage._id)
            .populate('sender', 'name email userType')
            .populate('receiver', 'name email userType');

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all users
router.get('/users', auth, async(req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all garages
router.get('/garages', auth, async(req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const garages = await Garage.find().populate('owner', 'name email');
        res.json(garages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;