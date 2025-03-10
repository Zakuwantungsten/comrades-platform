const mongoose = require('mongoose');
const Service = require('./models/Service');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
  migrateImages();
})
.catch(err => console.log(err));

async function migrateImages() {
  try {
    const services = await Service.find({});
    
    for (const service of services) {
      if (service.image && !service.imageUrl) {
        service.imageUrl = `data:image/jpeg;base64,${service.image.toString('base64')}`;
        await service.save();
        console.log(`Migrated image for service: ${service._id}`);
      }
    }
    
    console.log('Image migration completed');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}
