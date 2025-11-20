// routes/services.js
import express from 'express';
import Service from '../models/Service.js';
import Garage from '../models/Garage.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get services for garage owner
router.get('/my-services', auth, async(req, res) => {
    try {
        if (req.user.userType !== 'garage_owner') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const garage = await Garage.findOne({ owner: req.user.id });
        if (!garage) {
            return res.status(404).json({ message: 'Garage not found' });
        }

        const services = await Service.find({ garage: garage._id });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new service
router.post('/', auth, async(req, res) => {
    try {
        if (req.user.userType !== 'garage_owner') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const garage = await Garage.findOne({ owner: req.user.id });
        if (!garage) {
            return res.status(404).json({ message: 'Garage not found' });
        }

        const service = new Service({
            ...req.body,
            garage: garage._id
        });

        await service.save();
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update service
router.put('/:id', auth, async(req, res) => {
    try {
        if (req.user.userType !== 'garage_owner') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const service = await Service.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        );

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete service
router.delete('/:id', auth, async(req, res) => {
    try {
        if (req.user.userType !== 'garage_owner') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;