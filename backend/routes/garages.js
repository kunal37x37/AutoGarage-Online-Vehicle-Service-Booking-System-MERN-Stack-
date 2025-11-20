import express from 'express';
import Garage from '../models/Garage.js';
import { auth, requireGarageOwner } from '../middleware/auth.js';

const router = express.Router();

// Get all garages
router.get('/', async(req, res) => {
    try {
        const { search, location, service, page = 1, limit = 10 } = req.query;

        let query = { isActive: true };

        // Search by name or description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by location
        if (location) {
            query.city = { $regex: location, $options: 'i' };
        }

        // Filter by service
        if (service) {
            query['services.name'] = { $regex: service, $options: 'i' };
        }

        const garages = await Garage.find(query)
            .populate('owner', 'name email phone')
            .sort({ rating: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Garage.countDocuments(query);

        res.json({
            garages,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Get garages error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single garage
router.get('/:id', async(req, res) => {
    try {
        const garage = await Garage.findById(req.params.id)
            .populate('owner', 'name email phone')
            .populate('reviews.user', 'name');

        if (!garage) {
            return res.status(404).json({ message: 'Garage not found' });
        }

        res.json(garage);
    } catch (error) {
        console.error('Get garage error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create garage (Garage owners only)
router.post('/', auth, requireGarageOwner, async(req, res) => {
    try {
        const {
            name,
            description,
            address,
            city,
            pincode,
            phone,
            email,
            services,
            amenities,
            openingHours
        } = req.body;

        // Check if garage already exists for this owner
        const existingGarage = await Garage.findOne({ owner: req.user._id, name });
        if (existingGarage) {
            return res.status(400).json({ message: 'You already have a garage with this name' });
        }

        const garage = new Garage({
            owner: req.user._id,
            name,
            description,
            address,
            city,
            pincode,
            phone,
            email,
            services: services || [],
            amenities: amenities || [],
            openingHours: openingHours || {}
        });

        await garage.save();
        await garage.populate('owner', 'name email phone');

        res.status(201).json({
            message: 'Garage created successfully',
            garage
        });
    } catch (error) {
        console.error('Create garage error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update garage
router.put('/:id', auth, requireGarageOwner, async(req, res) => {
    try {
        const garage = await Garage.findOne({ _id: req.params.id, owner: req.user._id });

        if (!garage) {
            return res.status(404).json({ message: 'Garage not found' });
        }

        const updatedGarage = await Garage.findByIdAndUpdate(
            req.params.id, { $set: req.body }, { new: true }
        ).populate('owner', 'name email phone');

        res.json({
            message: 'Garage updated successfully',
            garage: updatedGarage
        });
    } catch (error) {
        console.error('Update garage error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get my garages (for garage owner)
router.get('/owner/my-garages', auth, requireGarageOwner, async(req, res) => {
    try {
        const garages = await Garage.find({ owner: req.user._id })
            .populate('owner', 'name email phone');

        res.json(garages);
    } catch (error) {
        console.error('Get my garages error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add review to garage
router.post('/:id/reviews', auth, async(req, res) => {
    try {
        const { rating, comment } = req.body;

        const garage = await Garage.findById(req.params.id);
        if (!garage) {
            return res.status(404).json({ message: 'Garage not found' });
        }

        // Check if user already reviewed
        const existingReview = garage.reviews.find(
            review => review.user.toString() === req.user._id.toString()
        );

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this garage' });
        }

        garage.reviews.push({
            user: req.user._id,
            rating,
            comment
        });

        // Calculate new average rating
        const totalRating = garage.reviews.reduce((sum, review) => sum + review.rating, 0);
        garage.rating = totalRating / garage.reviews.length;

        await garage.save();
        await garage.populate('reviews.user', 'name');

        res.json({
            message: 'Review added successfully',
            garage
        });
    } catch (error) {
        console.error('Add review error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;