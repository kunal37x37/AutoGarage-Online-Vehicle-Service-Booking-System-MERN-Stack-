import express from 'express';
import Message from '../models/Message.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Send message
router.post('/', auth, async(req, res) => {
    try {
        const { receiverId, garageId, content } = req.body;

        const message = new Message({
            sender: req.user._id,
            receiver: receiverId,
            garage: garageId,
            content
        });

        await message.save();
        await message.populate('sender', 'name');
        await message.populate('receiver', 'name');

        res.status(201).json({
            message: 'Message sent successfully',
            data: message
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get conversation between two users
router.get('/conversation/:userId', auth, async(req, res) => {
    try {
        const messages = await Message.find({
                $or: [
                    { sender: req.user._id, receiver: req.params.userId },
                    { sender: req.params.userId, receiver: req.user._id }
                ]
            })
            .populate('sender', 'name userType')
            .populate('receiver', 'name userType')
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error('Get conversation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's conversations list
router.get('/conversations', auth, async(req, res) => {
    try {
        const conversations = await Message.aggregate([{
                $match: {
                    $or: [
                        { sender: req.user._id },
                        { receiver: req.user._id }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ['$sender', req.user._id] },
                            then: '$receiver',
                            else: '$sender'
                        }
                    },
                    lastMessage: { $first: '$$ROOT' },
                    unreadCount: {
                        $sum: {
                            $cond: [{
                                    $and: [
                                        { $eq: ['$receiver', req.user._id] },
                                        { $eq: ['$isRead', false] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    'user.password': 0
                }
            }
        ]);

        res.json(conversations);
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Mark messages as read
router.put('/mark-read', auth, async(req, res) => {
    try {
        const { senderId } = req.body;

        await Message.updateMany({
            sender: senderId,
            receiver: req.user._id,
            isRead: false
        }, {
            $set: { isRead: true }
        });

        res.json({ message: 'Messages marked as read' });
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;