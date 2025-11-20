import express from 'express';
import Booking from '../models/Booking.js';
import Garage from '../models/Garage.js';
import { auth, requireGarageOwner } from '../middleware/auth.js';

const router = express.Router();

// Create booking
router.post('/', auth, async(req, res) => {
    try {
        const {
            garageId,
            service,
            vehicle,
            bookingDate,
            timeSlot,
            totalAmount,
            paymentMethod,
            specialInstructions
        } = req.body;

        const garage = await Garage.findById(garageId);
        if (!garage) {
            return res.status(404).json({ message: 'Garage not found' });
        }

        const booking = new Booking({
            user: req.user._id,
            garage: garageId,
            service,
            vehicle,
            bookingDate,
            timeSlot,
            totalAmount,
            paymentMethod,
            specialInstructions
        });

        await booking.save();
        await booking.populate('garage', 'name address phone');
        await booking.populate('user', 'name email phone');

        res.status(201).json({
            message: 'Booking created successfully',
            booking
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user bookings
router.get('/my-bookings', auth, async(req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('garage', 'name address phone rating')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get garage bookings (for garage owner)
router.get('/garage-bookings', auth, requireGarageOwner, async(req, res) => {
    try {
        // Find all garages owned by this user
        const garages = await Garage.find({ owner: req.user._id });
        const garageIds = garages.map(garage => garage._id);

        const bookings = await Booking.find({ garage: { $in: garageIds } })
            .populate('garage', 'name address')
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        console.error('Get garage bookings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update booking status
router.put('/:id/status', auth, requireGarageOwner, async(req, res) => {
    try {
        const { status } = req.body;

        const booking = await Booking.findById(req.params.id)
            .populate('garage');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if the garage belongs to the current user
        if (booking.garage.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this booking' });
        }

        booking.status = status;
        await booking.save();

        res.json({
            message: 'Booking status updated successfully',
            booking
        });
    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add rating and review to completed booking
router.post('/:id/review', auth, async(req, res) => {
    try {
        const { rating, review } = req.body;

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (booking.status !== 'completed') {
            return res.status(400).json({ message: 'Can only review completed bookings' });
        }

        booking.rating = rating;
        booking.review = review;
        await booking.save();

        // Also add review to garage
        const garage = await Garage.findById(booking.garage);
        garage.reviews.push({
            user: req.user._id,
            rating,
            comment: review
        });

        // Recalculate garage rating
        const totalRating = garage.reviews.reduce((sum, rev) => sum + rev.rating, 0);
        garage.rating = totalRating / garage.reviews.length;

        await garage.save();

        res.json({
            message: 'Review added successfully',
            booking
        });
    } catch (error) {
        console.error('Add review error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;