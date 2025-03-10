const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },

  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
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
    required: true
  },
  contactInfo: {
    type: String,
    required: true
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
  }

}, {
  timestamps: true,
  autoIndex: true
});



module.exports = mongoose.model('Service', serviceSchema);
