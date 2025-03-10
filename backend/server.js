const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http'); // Added
const { Server } = require('socket.io'); // Added
const Message = require('./models/Message'); // Added

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const PORT = process.env.PORT || 5000; // Use environment variable or default to 5000

const serviceRoutes = require('./routes/serviceRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const serviceRequestRoutes = require('./routes/serviceRequestRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const auth = require('./middleware/auth');

// Initialize Express app
const app = express();
const messageRoutes = require('./routes/messageRoutes'); // Import message routes

// Middleware
app.use(express.json());
app.use(cors());

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/api/messages', messageRoutes); // Use message routes

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('MONGO_URI is not defined in .env file');
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  maxPoolSize: 50, // Maximum number of sockets in the connection pool
  minPoolSize: 5, // Minimum number of sockets in the connection pool
  socketTimeoutMS: 30000, // Close sockets after 30 seconds of inactivity
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  maxIdleTimeMS: 30000 // Remove a socket from the pool after 30 seconds of inactivity
})
  .then(() => {
    console.log('MongoDB connected');
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });
    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
      console.warn('Mongoose disconnected from DB');
    });
  })
  .catch(err => console.log(err));

// Routes
app.use('/api/services', serviceRoutes); // Re-enabling this route
app.use('/api/auth', userRoutes); 
app.use('/api/reviews', reviewRoutes); 
app.use('/api/service-requests', serviceRequestRoutes); 
app.use('/api/notifications', notificationRoutes); 
app.use('/api/admin', adminRoutes); 

// Test route
app.get('/', (req, res) => {
  res.send('Comrades Platform API');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  // Listen for messages
  socket.on('sendMessage', async (data) => {
    const { sender, receiver, content } = data;

    // Save the message to MongoDB
    const message = new Message({ sender, receiver, content });
    await message.save();

    // Broadcast the message to the recipient
    io.to(receiver).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log('Starting server...');
  console.log(`Server running on port ${PORT}`);
  console.log('Connecting to MongoDB...');
}).on('error', (err) => {
  console.error('Server failed to start:', err);
});