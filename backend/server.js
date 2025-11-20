// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://apple2:abc123abc123@autogarage.vumlouz.mongodb.net/autogarage2?retryWrites=true&w=majority';

console.log('🔗 Connecting to MongoDB Atlas...');

mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
    })
    .then(() => {
        console.log('✅ MongoDB Atlas connected successfully');
    })
    .catch((error) => {
        console.error('❌ MongoDB Atlas connection error:', error.message);
        process.exit(1);
    });

// Schema Definitions (same as before)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ['customer', 'garage_owner'], default: 'customer' },
    phone: String,
    address: String,
    city: String,
    pincode: String,
    createdAt: { type: Date, default: Date.now }
});

const garageSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: String,
    location: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    address: { type: String, required: true },
    services: [String],
    serviceDetails: [{
        name: String,
        price: Number,
        duration: String,
        description: String
    }],
    openingHours: {
        open: { type: String, required: true },
        close: { type: String, required: true },
        days: { type: String, required: true }
    },
    contactNumber: String,
    email: String,
    images: [String],
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const serviceSchema = new mongoose.Schema({
    garage: { type: mongoose.Schema.Types.ObjectId, ref: 'Garage', required: true },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    duration: String,
    category: String,
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const bookingSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    garage: { type: mongoose.Schema.Types.ObjectId, ref: 'Garage', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    serviceName: { type: String, required: true },
    servicePrice: { type: Number, required: true },
    vehicleInfo: {
        make: String,
        model: String,
        year: Number,
        licensePlate: String
    },
    date: { type: Date, required: true },
    time: String,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    totalAmount: Number,
    paymentMethod: { type: String, default: 'pay_at_garage' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    specialInstructions: String,
    cancelledAt: Date,
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cancellationReason: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Add pre-save middleware to update updatedAt
bookingSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    garage: { type: mongoose.Schema.Types.ObjectId, ref: 'Garage' },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Garage = mongoose.model('Garage', garageSchema);
const Service = mongoose.model('Service', serviceSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Message = mongoose.model('Message', messageSchema);

// JWT Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'autogarage_secret', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Initialize default data (same as before)
const initializeDefaultData = async() => {
    try {
        // Check if admin user exists
        const adminExists = await User.findOne({ email: 'admin@autogarage.com' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 12);
            const adminUser = new User({
                name: 'Admin User',
                email: 'admin@autogarage.com',
                password: hashedPassword,
                userType: 'garage_owner',
                phone: '+91 9876543210'
            });
            await adminUser.save();
            console.log('✅ Admin user created');
        }

        // Check if sample garages exist
        const garageCount = await Garage.countDocuments();
        if (garageCount === 0) {
            const adminUser = await User.findOne({ email: 'admin@autogarage.com' });

            const sampleGarages = [{
                    owner: adminUser._id,
                    name: 'City Auto Care',
                    description: 'Professional auto care services with experienced mechanics.',
                    location: 'Mumbai',
                    city: 'Mumbai',
                    pincode: '400001',
                    address: '123 MG Road, Fort, Mumbai',
                    services: ['Oil Change', 'General Maintenance', 'Battery Replacement', 'Engine Diagnostics'],
                    serviceDetails: [
                        { name: 'Oil Change', price: 300, duration: '30-45 mins', description: 'Professional oil change services' },
                        { name: 'General Maintenance', price: 500, duration: '1-2 hours', description: 'Complete car maintenance' },
                        { name: 'Battery Replacement', price: 800, duration: '1 hour', description: 'Battery testing and replacement' },
                        { name: 'Engine Diagnostics', price: 600, duration: '1-2 hours', description: 'Advanced engine diagnostics' }
                    ],
                    openingHours: {
                        open: '09:00',
                        close: '18:00',
                        days: 'Monday - Saturday'
                    },
                    contactNumber: '+91 9876543211',
                    email: 'cityautocare@example.com',
                    rating: 4.8,
                    reviews: 124,
                    isVerified: true
                },
                {
                    owner: adminUser._id,
                    name: 'Premium Car Services',
                    description: 'Premium car servicing with genuine parts.',
                    location: 'Delhi',
                    city: 'Delhi',
                    pincode: '110001',
                    address: '45 Connaught Place, New Delhi',
                    services: ['Engine Diagnostics', 'AC Service', 'Brake Service', 'Tire Service'],
                    serviceDetails: [
                        { name: 'Engine Diagnostics', price: 600, duration: '1-2 hours', description: 'Complete engine diagnostics' },
                        { name: 'AC Service', price: 900, duration: '1-2 hours', description: 'AC repair and maintenance' },
                        { name: 'Brake Service', price: 1200, duration: '2-3 hours', description: 'Brake inspection and repair' },
                        { name: 'Tire Service', price: 400, duration: '1 hour', description: 'Tire repair and replacement' }
                    ],
                    openingHours: {
                        open: '08:00',
                        close: '20:00',
                        days: 'Monday - Sunday'
                    },
                    contactNumber: '+91 9876543212',
                    email: 'premiumcars@example.com',
                    rating: 4.5,
                    reviews: 89,
                    isVerified: true
                }
            ];

            await Garage.insertMany(sampleGarages);
            console.log('✅ Sample garages created');

            // Create sample services in Service collection
            const garages = await Garage.find();
            for (const garage of garages) {
                const services = [
                    { name: 'General Maintenance', price: 500, duration: '1-2 hours', category: 'Maintenance' },
                    { name: 'Oil Change', price: 300, duration: '30-45 mins', category: 'Maintenance' },
                    { name: 'Battery Replacement', price: 800, duration: '1 hour', category: 'Electrical' },
                    { name: 'Engine Diagnostics', price: 600, duration: '1-2 hours', category: 'Diagnostics' }
                ];

                const garageServices = services.map(service => ({
                    garage: garage._id,
                    ...service
                }));

                await Service.insertMany(garageServices);
            }
            console.log('✅ Sample services created');
        }
    } catch (error) {
        console.error('❌ Error initializing default data:', error.message);
    }
};

// ==================== AUTH ROUTES ====================
app.post('/api/auth/register', async(req, res) => {
    try {
        const { name, email, password, userType, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            userType: userType || 'customer',
            phone
        });

        await user.save();

        const token = jwt.sign({ userId: user._id, email: user.email, userType: user.userType },
            process.env.JWT_SECRET || 'autogarage_secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/api/auth/login', async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id, email: user.email, userType: user.userType },
            process.env.JWT_SECRET || 'autogarage_secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/api/auth/me', authenticateToken, async(req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        console.error('Auth me error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ==================== GARAGE ROUTES ====================
app.post('/api/garages', authenticateToken, async(req, res) => {
    try {
        const {
            name,
            description,
            location,
            city,
            pincode,
            address,
            services,
            serviceDetails,
            openingHours,
            contactNumber,
            email
        } = req.body;

        if (!name || !location || !city || !pincode || !address || !contactNumber) {
            return res.status(400).json({
                message: 'Name, location, city, pincode, address and contact number are required'
            });
        }

        if (!services || services.length === 0) {
            return res.status(400).json({ message: 'At least one service must be selected' });
        }

        if (!openingHours || !openingHours.open || !openingHours.close || !openingHours.days) {
            return res.status(400).json({ message: 'Opening hours are required' });
        }

        const garage = new Garage({
            owner: req.user.userId,
            name,
            description,
            location,
            city,
            pincode,
            address,
            services,
            serviceDetails: serviceDetails || [],
            openingHours,
            contactNumber,
            email
        });

        await garage.save();
        await garage.populate('owner', 'name email phone');

        // Create services in Service collection
        if (serviceDetails && serviceDetails.length > 0) {
            for (const service of serviceDetails) {
                const newService = new Service({
                    garage: garage._id,
                    name: service.name,
                    price: service.price || 0,
                    duration: service.duration || '1-2 hours',
                    description: service.description || '',
                    category: 'General'
                });
                await newService.save();
            }
        }

        res.status(201).json({
            message: 'Garage created successfully',
            garage
        });
    } catch (error) {
        console.error('Create garage error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/api/garages', async(req, res) => {
    try {
        const { location, service, search, city } = req.query;
        let query = { isVerified: true };

        if (location) query.location = new RegExp(location, 'i');
        if (city) query.city = new RegExp(city, 'i');
        if (service) query.services = { $in: [new RegExp(service, 'i')] };
        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { location: new RegExp(search, 'i') },
                { city: new RegExp(search, 'i') },
                { services: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const garages = await Garage.find(query)
            .populate('owner', 'name email phone')
            .sort({ rating: -1, reviews: -1, createdAt: -1 });

        res.json(garages);
    } catch (error) {
        console.error('Get garages error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/api/garages/my-garages', authenticateToken, async(req, res) => {
    try {
        const garages = await Garage.find({ owner: req.user.userId })
            .populate('owner', 'name email phone')
            .sort({ createdAt: -1 });
        res.json(garages);
    } catch (error) {
        console.error('Get my garages error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/api/garages/:id', async(req, res) => {
    try {
        const garage = await Garage.findById(req.params.id)
            .populate('owner', 'name email phone');

        if (!garage) {
            return res.status(404).json({ message: 'Garage not found' });
        }

        res.json(garage);
    } catch (error) {
        console.error('Get garage by id error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.put('/api/garages/:id', authenticateToken, async(req, res) => {
    try {
        const { name, description, location, city, pincode, address, services, serviceDetails, openingHours, contactNumber, email } = req.body;

        const garage = await Garage.findById(req.params.id);

        if (!garage) {
            return res.status(404).json({ message: 'Garage not found' });
        }

        if (garage.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to update this garage' });
        }

        garage.name = name || garage.name;
        garage.description = description || garage.description;
        garage.location = location || garage.location;
        garage.city = city || garage.city;
        garage.pincode = pincode || garage.pincode;
        garage.address = address || garage.address;
        garage.services = services || garage.services;
        garage.serviceDetails = serviceDetails || garage.serviceDetails;
        garage.openingHours = openingHours || garage.openingHours;
        garage.contactNumber = contactNumber || garage.contactNumber;
        garage.email = email || garage.email;

        await garage.save();
        await garage.populate('owner', 'name email phone');

        // Update services in Service collection
        if (serviceDetails && serviceDetails.length > 0) {
            // Delete existing services
            await Service.deleteMany({ garage: garage._id });

            // Create new services
            for (const service of serviceDetails) {
                const newService = new Service({
                    garage: garage._id,
                    name: service.name,
                    price: service.price || 0,
                    duration: service.duration || '1-2 hours',
                    description: service.description || '',
                    category: 'General'
                });
                await newService.save();
            }
        }

        res.json({
            message: 'Garage updated successfully',
            garage
        });
    } catch (error) {
        console.error('Update garage error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.delete('/api/garages/:id', authenticateToken, async(req, res) => {
    try {
        const garage = await Garage.findById(req.params.id);

        if (!garage) {
            return res.status(404).json({ message: 'Garage not found' });
        }

        if (garage.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this garage' });
        }

        await Garage.findByIdAndDelete(req.params.id);
        await Service.deleteMany({ garage: req.params.id });
        await Booking.deleteMany({ garage: req.params.id });

        res.json({ message: 'Garage deleted successfully' });
    } catch (error) {
        console.error('Delete garage error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ==================== SERVICE ROUTES ====================
app.post('/api/services', authenticateToken, async(req, res) => {
    try {
        const { garageId, name, description, price, duration, category } = req.body;

        if (!garageId || !name || price === undefined) {
            return res.status(400).json({ message: 'Garage ID, name and price are required' });
        }

        const garage = await Garage.findOne({ _id: garageId, owner: req.user.userId });
        if (!garage) {
            return res.status(403).json({ message: 'Not authorized to add services to this garage' });
        }

        const service = new Service({
            garage: garageId,
            name,
            description,
            price: parseInt(price) || 0,
            duration: duration || '1-2 hours',
            category: category || 'General'
        });

        await service.save();
        res.status(201).json({
            message: 'Service added successfully',
            service
        });
    } catch (error) {
        console.error('Create service error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/api/garages/:garageId/services', async(req, res) => {
    try {
        const { garageId } = req.params;

        console.log('Fetching services for garage:', garageId);

        // First try to get services from Service collection
        let services = await Service.find({
            garage: garageId,
            isActive: true
        }).sort({ createdAt: -1 });

        // If no services found in Service collection, check garage's serviceDetails
        if (services.length === 0) {
            console.log('No services in Service collection, checking garage serviceDetails');
            const garage = await Garage.findById(garageId);
            if (garage && garage.serviceDetails && garage.serviceDetails.length > 0) {
                services = garage.serviceDetails.map((service, index) => ({
                    _id: `garage-service-${index}`,
                    name: service.name,
                    description: service.description,
                    price: service.price || 0,
                    duration: service.duration || '1-2 hours',
                    category: 'General',
                    isFromGarage: true
                }));
            }
        }

        console.log('Found services:', services.length);

        res.json(services);
    } catch (error) {
        console.error('Get services error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.put('/api/services/:id', authenticateToken, async(req, res) => {
    try {
        const { name, description, price, duration, category } = req.body;

        const service = await Service.findById(req.params.id).populate('garage');

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        if (service.garage.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to update this service' });
        }

        service.name = name || service.name;
        service.description = description || service.description;
        service.price = price || service.price;
        service.duration = duration || service.duration;
        service.category = category || service.category;

        await service.save();

        res.json({
            message: 'Service updated successfully',
            service
        });
    } catch (error) {
        console.error('Update service error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.delete('/api/services/:id', authenticateToken, async(req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate('garage');

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        if (service.garage.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this service' });
        }

        await Service.findByIdAndDelete(req.params.id);

        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Delete service error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete all services for a garage
app.delete('/api/services/garage/:garageId', authenticateToken, async(req, res) => {
    try {
        const { garageId } = req.params;

        const garage = await Garage.findOne({ _id: garageId, owner: req.user.userId });
        if (!garage) {
            return res.status(403).json({ message: 'Not authorized to delete services for this garage' });
        }

        const result = await Service.deleteMany({ garage: garageId });
        res.json({
            message: 'Services deleted successfully',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Delete services error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ==================== BOOKING ROUTES ====================

// Multiple services booking
app.post('/api/bookings', authenticateToken, async(req, res) => {
    try {
        const {
            garageId,
            serviceId,
            serviceName,
            servicePrice,
            vehicleInfo,
            date,
            time,
            paymentMethod,
            specialInstructions,
            totalAmount
        } = req.body;

        if (!garageId || !date || !time) {
            return res.status(400).json({ message: 'Garage ID, date and time are required' });
        }

        const garage = await Garage.findById(garageId);
        if (!garage) {
            return res.status(404).json({ message: 'Garage not found' });
        }

        // Determine service name and price
        let finalServiceName = serviceName || 'Car Service';
        let finalServicePrice = servicePrice || 0;
        let finalServiceId = serviceId || null;

        if (serviceId && mongoose.Types.ObjectId.isValid(serviceId)) {
            const service = await Service.findById(serviceId);
            if (service) {
                finalServiceName = service.name;
                finalServicePrice = service.price;
                finalServiceId = service._id;
            }
        }

        const booking = new Booking({
            customer: req.user.userId,
            garage: garageId,
            service: finalServiceId,
            serviceName: finalServiceName,
            servicePrice: finalServicePrice,
            vehicleInfo,
            date: new Date(date),
            time,
            totalAmount: totalAmount || finalServicePrice,
            paymentMethod: paymentMethod || 'pay_at_garage',
            specialInstructions
        });

        await booking.save();

        // Populate all references
        await booking.populate('customer', 'name email phone');
        await booking.populate('garage', 'name location address contactNumber');
        await booking.populate('service', 'name price duration');

        res.status(201).json({
            message: 'Booking created successfully',
            booking
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/api/bookings/my-bookings', authenticateToken, async(req, res) => {
    try {
        const bookings = await Booking.find({ customer: req.user.userId })
            .populate('garage', 'name location address contactNumber')
            .populate('service', 'name price duration')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        console.error('Get my bookings error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/api/bookings/garage-bookings', authenticateToken, async(req, res) => {
    try {
        const userGarages = await Garage.find({ owner: req.user.userId });
        const garageIds = userGarages.map(garage => garage._id);

        const bookings = await Booking.find({ garage: { $in: garageIds } })
            .populate('customer', 'name email phone')
            .populate('garage', 'name location')
            .populate('service', 'name price')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        console.error('Get garage bookings error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.put('/api/bookings/:id/status', authenticateToken, async(req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const booking = await Booking.findById(req.params.id)
            .populate('garage');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const garage = await Garage.findOne({ _id: booking.garage._id, owner: req.user.userId });
        if (!garage) {
            return res.status(403).json({ message: 'Not authorized to update this booking' });
        }

        booking.status = status;
        await booking.save();

        await booking.populate('customer', 'name email phone');
        await booking.populate('service', 'name price');

        res.json({
            message: 'Booking status updated successfully',
            booking
        });
    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ==================== MESSAGE ROUTES ====================
app.post('/api/messages', authenticateToken, async(req, res) => {
    try {
        const { receiverId, garageId, message } = req.body;

        if (!receiverId || !message) {
            return res.status(400).json({ message: 'Receiver ID and message are required' });
        }

        const newMessage = new Message({
            sender: req.user.userId,
            receiver: receiverId,
            garage: garageId,
            message
        });

        await newMessage.save();
        await newMessage.populate('sender', 'name userType');
        await newMessage.populate('receiver', 'name userType');

        res.status(201).json({
            message: 'Message sent successfully',
            newMessage
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/api/messages/garage/:garageId', authenticateToken, async(req, res) => {
    try {
        const messages = await Message.find({
                garage: req.params.garageId,
                $or: [
                    { sender: req.user.userId },
                    { receiver: req.user.userId }
                ]
            })
            .populate('sender', 'name userType')
            .populate('receiver', 'name userType')
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ==================== USER PROFILE ROUTES ====================
app.put('/api/users/profile', authenticateToken, async(req, res) => {
    try {
        const { name, phone, address, city, pincode } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.userId, { name, phone, address, city, pincode }, { new: true }
        ).select('-password');

        res.json({
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ==================== DASHBOARD ROUTES ====================
app.get('/api/dashboard/stats', authenticateToken, async(req, res) => {
    try {
        if (req.user.userType === 'customer') {
            const totalBookings = await Booking.countDocuments({ customer: req.user.userId });
            const pendingBookings = await Booking.countDocuments({
                customer: req.user.userId,
                status: 'pending'
            });
            const completedBookings = await Booking.countDocuments({
                customer: req.user.userId,
                status: 'completed'
            });

            res.json({
                totalBookings,
                pendingBookings,
                completedBookings
            });
        } else if (req.user.userType === 'garage_owner') {
            const userGarages = await Garage.find({ owner: req.user.userId });
            const garageIds = userGarages.map(garage => garage._id);

            const totalBookings = await Booking.countDocuments({ garage: { $in: garageIds } });
            const pendingBookings = await Booking.countDocuments({
                garage: { $in: garageIds },
                status: 'pending'
            });
            const completedBookings = await Booking.countDocuments({
                garage: { $in: garageIds },
                status: 'completed'
            });
            const totalGarages = userGarages.length;

            const revenueResult = await Booking.aggregate([
                { $match: { garage: { $in: garageIds }, status: 'completed' } },
                { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
            ]);

            const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

            res.json({
                totalBookings,
                pendingBookings,
                completedBookings,
                totalGarages,
                totalRevenue
            });
        }
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
    res.json({
        message: 'AutoGarage API is running with MongoDB Atlas',
        timestamp: new Date().toISOString(),
        database: 'MongoDB Atlas'
    });
});

// Cancel booking route
app.put('/api/bookings/:id/cancel', authenticateToken, async(req, res) => {
    try {
        const { status } = req.body;

        if (!status || status !== 'cancelled') {
            return res.status(400).json({ message: 'Invalid status for cancellation' });
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user is authorized to cancel this booking
        if (req.user.userType === 'customer') {
            if (booking.customer.toString() !== req.user.userId) {
                return res.status(403).json({ message: 'Not authorized to cancel this booking' });
            }
        } else if (req.user.userType === 'garage_owner') {
            const garage = await Garage.findOne({ _id: booking.garage, owner: req.user.userId });
            if (!garage) {
                return res.status(403).json({ message: 'Not authorized to cancel this booking' });
            }
        }

        // Check if booking can be cancelled
        if (booking.status === 'completed' || booking.status === 'cancelled') {
            return res.status(400).json({ message: `Booking is already ${booking.status}` });
        }

        booking.status = 'cancelled';
        await booking.save();

        await booking.populate('customer', 'name email phone');
        await booking.populate('garage', 'name location address contactNumber');
        await booking.populate('service', 'name price duration');

        res.json({
            message: 'Booking cancelled successfully',
            booking
        });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Initialize default data
initializeDefaultData();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚗 AutoGarage Server running on port ${PORT}`);
    console.log(`🌐 Database: MongoDB Atlas`);
    console.log(`✅ All features are enabled and working!`);
});