const mongoose = require('mongoose');
const Service = require('./models/Service');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('MongoDB connected');
  deleteServices();
})
.catch(err => console.log(err));

async function deleteServices() {
  try {
    const result = await Service.deleteMany({});
    console.log(`Deleted ${result.deletedCount} services`);
    process.exit(0);
  } catch (error) {
    console.error('Error deleting services:', error);
    process.exit(1);
  }
}
