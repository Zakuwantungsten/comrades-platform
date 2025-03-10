const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'nassorhamdu@gmail.com' });

    if (existingAdmin) {
      await User.deleteOne({ email: 'najmamohammed@gmail.com' });
    }

    // Create admin user with proper password hashing
    const admin = new User({
      name: 'Nassor Hamdu',
      email: 'nassorhamdu@gmail.com',
      password: 'nassor', // Will be hashed by pre-save hook
      isAdmin: true

    });


    await admin.save();
    console.log('New admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
