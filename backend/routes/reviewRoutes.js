const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Review = require('../models/Review');
const Service = require('../models/Service');
const auth = require('../middleware/auth');


async function updateServiceRating(serviceId) {
  const reviews = await Review.find({ service: serviceId });
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;
  
  await Service.findByIdAndUpdate(serviceId, {
    rating: avgRating,
    numReviews: reviews.length
  });
}

// Create a new review
router.post('/', auth(), async (req, res) => {
  try {
    // Check if user already reviewed this service
    const existingReview = await Review.findOne({
      service: req.body.service,
      user: req.user._id
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this service' });
    }

    const review = new Review({
      service: new mongoose.Types.ObjectId(req.body.service),
      rating: req.body.rating,
      comment: req.body.comment,
      user: new mongoose.Types.ObjectId(req.user._id)

    });


    await review.save();
    await updateServiceRating(req.body.service);
    res.status(201).json(review);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get reviews for a service with pagination
router.get('/service/:serviceId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ service: req.params.serviceId })
        .populate('user', 'name')
        .skip(skip)
        .limit(limit),
      Review.countDocuments({ service: req.params.serviceId })
    ]);

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a review
router.put('/:id', auth(), async (req, res) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!review) return res.status(404).json({ message: 'Review not found' });
    await updateServiceRating(review.service);
    res.json(review);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a review
router.delete('/:id', auth(), async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    await updateServiceRating(review.service);
    res.json({ message: 'Review deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
