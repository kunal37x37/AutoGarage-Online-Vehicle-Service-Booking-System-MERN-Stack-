import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    garage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Garage',
        required: true
    },
    service: {
        name: String,
        price: Number,
        duration: String
    },
    vehicle: {
        make: String,
        model: String,
        year: Number,
        licensePlate: String
    },
    bookingDate: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'upi', 'cash'],
        default: 'cash'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    specialInstructions: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

export default mongoose.model('Booking', bookingSchema);