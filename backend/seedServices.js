const mongoose = require('mongoose');
const Service = require('./models/Service');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });



const sampleServices = [
  {
    title: 'Math Tutoring',
    description: 'Expert math tutoring for all levels',
    image: 'math-tutoring.jpg',
    category: 'Tutoring',
    price: 20,
    location: 'Online',
    contactInfo: 'math@tutor.com',
    status: 'available'
  },
  {
    title: 'Graphic Design',
    description: 'Professional graphic design services',
    image: 'graphic-design.jpg',
    category: 'Design',
    price: 50,
    location: 'Nairobi',
    contactInfo: 'design@example.com',
    status: 'available'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect('mongodb+srv://comradesAdmin:wAbl4MwCTKAhfdNP@cluster0.5ztrw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {

      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Clear existing services
    await Service.deleteMany({});

    // Find a user to associate with services
    const user = await User.findOne({});
    if (!user) {
      console.error('No users found in database. Please create a user first.');
      process.exit(1);
    }

    // Add provider to services
    const servicesWithProvider = sampleServices.map(service => ({
      ...service,
      provider: user._id
    }));

    // Insert sample services
    await Service.insertMany(servicesWithProvider);
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
