const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['request', 'accept', 'reject', 'message', 'system'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  relatedService: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  },
  relatedRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceRequest'
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
