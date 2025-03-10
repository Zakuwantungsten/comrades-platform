const express = require('express');
const multer = require('multer');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Service routes are working' });
});

// Configure multer for file uploads
const sharp = require('sharp');
const upload = multer({
  limits: {
    fileSize: 5000000 // 5MB limit
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image file (jpg, jpeg, or png)'));
    }
    cb(null, true);
  }
});

const compressImage = async (buffer) => {
  return await sharp(buffer)
    .resize(800, 800, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ 
      quality: 80,
      mozjpeg: true 
    })
    .toBuffer();
};

// Create a new service
const serviceValidationRules = [
  check('title').notEmpty().withMessage('Title is required'),
  check('description').notEmpty().withMessage('Description is required'),
  check('price').isNumeric().withMessage('Price must be a number'),
  check('category').notEmpty().withMessage('Category is required'),
  check('location').notEmpty().withMessage('Location is required')
];

router.post('/', 
  auth, 
  upload.single('image'), 
  serviceValidationRules,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        errors: errors.array(),
        message: 'Validation failed'
      });
    }

    try {
      let imageUrl = '';
      if (req.file) {
        const compressedImage = await compressImage(req.file.buffer);
        imageUrl = `data:${req.file.mimetype};base64,${compressedImage.toString('base64')}`;
      }
      
      const serviceData = {
        ...req.body,
        provider: req.user._id,
        ...(imageUrl && { imageUrl })
      };

      const service = new Service(serviceData); // Ensure all required fields are provided

      await service.save();
      res.status(201).json(service);
    } catch (error) {
      console.error('Error creating service:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to create service',
        error: error.message 
      });
    }
});

// Get services by user
router.get('/user/:userId', [
  check('userId').isMongoId().withMessage('Invalid user ID')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      errors: errors.array(),
      message: 'Validation failed'
    });
  }

  try {
    const services = await Service.find({ provider: req.params.userId }).populate('provider', 'name email');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all services
router.get('/all', async (req, res) => {
  try {
    console.log("Fetching all services");
    const services = await Service.find().populate('provider', 'name email'); // Fetch all services

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single service
router.get('/:id', [
  check('id').isMongoId().withMessage('Invalid service ID')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      errors: errors.array(),
      message: 'Validation failed'
    });
  }

  try {
    const service = await Service.findById(req.params.id).populate('provider', 'name email');
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a service
router.put('/:id', 
  auth(),
  serviceValidationRules,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        errors: errors.array(),
        message: 'Validation failed'
      });
    }

    try {
      const service = await Service.findOneAndUpdate(
        { _id: req.params.id, provider: req.user._id },
        req.body,
        { new: true }
      );
      if (!service) return res.status(404).json({ message: 'Service not found or unauthorized' });
      res.json(service);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

// Delete a service
router.delete('/:id', 
  auth(),
  [check('id').isMongoId().withMessage('Invalid service ID')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        errors: errors.array(),
        message: 'Validation failed'
      });
    }

    try {
      const service = await Service.findOneAndDelete({
        _id: req.params.id,
        provider: req.user._id
      });
      if (!service) return res.status(404).json({ message: 'Service not found or unauthorized' });
      res.json({ message: 'Service deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

module.exports = router;
