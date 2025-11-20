import mongoose from 'mongoose';

const garageSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    services: [{
        name: String,
        price: Number,
        duration: String,
        description: String
    }],
    amenities: [String],
    images: [String],
    openingHours: {
        Monday: { open: String, close: String },
        Tuesday: { open: String, close: String },
        Wednesday: { open: String, close: String },
        Thursday: { open: String, close: String },
        Friday: { open: String, close: String },
        Saturday: { open: String, close: String },
        Sunday: { open: String, close: String }
    },
    rating: {
        type: Number,
        default: 0
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: Number,
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create 2dsphere index for location-based queries
garageSchema.index({ location: '2dsphere' });

export default mongoose.model('Garage', garageSchema);