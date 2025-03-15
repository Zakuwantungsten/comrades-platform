import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
    title: {
        type: String,
        required: true,
        index: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        match: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i // Ensure it's a valid image URL
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    contactInfo: {
        email: {
            type: String,
            required: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
        },
        phone: {
            type: String,
            required: true,
            match: [/^\+?\d{10,15}$/, 'Invalid phone number']
        }
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available'
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numReviews: {
        type: Number,
        default: 0
    },
    slug: {
        type: String,
        unique: true
    }
}, {
    timestamps: true,
    autoIndex: true
});

// Indexing for better performance
ServiceSchema.index({ title: "text", category: "text", location: "text" });

// Generate slug from title before saving
ServiceSchema.pre('save', function (next) {
    this.slug = this.title.toLowerCase().replace(/\s+/g, '-');
    next();
});

const Service = mongoose.model('Service', ServiceSchema);
export default Service;
