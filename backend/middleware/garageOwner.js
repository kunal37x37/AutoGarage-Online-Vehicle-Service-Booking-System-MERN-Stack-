// routes/garageOwner.js
import express from 'express';
import Booking from '../models/Booking.js';
import Garage from '../models/Garage.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get garage owner dashboard stats
router.get('/dashboard-stats', auth, async(req, res) => {
    try {
        console.log('Dashboard stats requested by user:', req.user.id);

        if (req.user.userType !== 'garage_owner') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Find all garages owned by this user
        const garages = await Garage.find({ owner: req.user.id });
        console.log('Found garages:', garages.length);

        if (garages.length === 0) {
            return res.json({
                totalBookings: 0,
                pendingBookings: 0,
                completedBookings: 0,
                totalServices: 0,
                totalRevenue: 0,
                totalGarages: 0
            });
        }

        const garageIds = garages.map(garage => garage._id);

        // Get bookings for all garages owned by this user
        const totalBookings = await Booking.countDocuments({ garage: { $in: garageIds } });
        const pendingBookings = await Booking.countDocuments({
            garage: { $in: garageIds },
            status: 'pending'
        });
        const completedBookings = await Booking.countDocuments({
            garage: { $in: garageIds },
            status: 'completed'
        });

        // Get services for all garages
        const totalServices = await Service.countDocuments({ garage: { $in: garageIds } });

        // Calculate total revenue
        const revenueData = await Booking.aggregate([{
                $match: {
                    garage: { $in: garageIds },
                    paymentStatus: 'paid'
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const stats = {
            totalBookings,
            pendingBookings,
            completedBookings,
            totalServices,
            totalRevenue: revenueData[0] ? .total || 0,
            totalGarages: garages.length
        };

        console.log('Sending stats:', stats);
        res.json(stats);
    } catch (error) {
        console.error('Error in dashboard stats:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get garage bookings
router.get('/bookings', auth, async(req, res) => {
    try {
        console.log('Bookings requested by user:', req.user.id);

        if (req.user.userType !== 'garage_owner') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const garages = await Garage.find({ owner: req.user.id });
        if (garages.length === 0) {
            return res.json([]);
        }

        const garageIds = garages.map(garage => garage._id);

        const bookings = await Booking.find({ garage: { $in: garageIds } })
            .populate('user', 'name email phone')
            .populate('garage', 'name location')
            .sort({ createdAt: -1 });

        console.log('Found bookings:', bookings.length);
        res.json(bookings);
    } catch (error) {
        console.error('Error in bookings:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get garage owner's garages
router.get('/my-garages', auth, async(req, res) => {
    try {
        console.log('Garages requested by user:', req.user.id);

        if (req.user.userType !== 'garage_owner') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const garages = await Garage.find({ owner: req.user.id })
            .populate('services')
            .sort({ createdAt: -1 });

        console.log('Found garages:', garages.length);
        res.json(garages);
    } catch (error) {
        console.error('Error in my-garages:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get services for garage owner
router.get('/my-services', auth, async(req, res) => {
    try {
        console.log('Services requested by user:', req.user.id);

        if (req.user.userType !== 'garage_owner') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const garages = await Garage.find({ owner: req.user.id });
        if (garages.length === 0) {
            return res.json([]);
        }

        const garageIds = garages.map(garage => garage._id);
        const services = await Service.find({ garage: { $in: garageIds } });

        console.log('Found services:', services.length);
        res.json(services);
    } catch (error) {
        console.error('Error in my-services:', error);
        res.status(500).json({ message: error.message });
    }
});

// Update booking status
router.put('/bookings/:id/status', auth, async(req, res) => {
    try {
        if (req.user.userType !== 'garage_owner') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { status } = req.body;

        // Check if the booking belongs to user's garage
        const garages = await Garage.find({ owner: req.user.id });
        const garageIds = garages.map(garage => garage._id);

        const booking = await Booking.findOne({
            _id: req.params.id,
            garage: { $in: garageIds }
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found or access denied' });
        }

        booking.status = status;
        await booking.save();

        const updatedBooking = await Booking.findById(booking._id)
            .populate('user', 'name email')
            .populate('garage', 'name');

        res.json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;