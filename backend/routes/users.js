// backend/routes/messages.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const auth = require('../middleware/auth');

// Send message
router.post('/', auth, async(req, res) => {
    try {
        const { conversationId, message, receiverId } = req.body;

        const newMessage = new Message({
            conversation: conversationId,
            sender: req.user.id,
            receiver: receiverId,
            message: message
        });

        await newMessage.save();
        await newMessage.populate('sender receiver');

        // Update conversation timestamp
        await Conversation.findByIdAndUpdate(conversationId, {
            updatedAt: Date.now(),
            lastMessage: message
        });

        res.json({ message: newMessage });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get messages for conversation
router.get('/conversation/:conversationId', auth, async(req, res) => {
    try {
        const messages = await Message.find({
                conversation: req.params.conversationId
            })
            .populate('sender receiver')
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;