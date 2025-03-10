# Project Setup on Kali Linux

## 1. Install Node.js and npm
```bash
sudo apt update
sudo apt install nodejs npm
```

## 2. Install MongoDB
```bash
sudo apt install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## 3. Clone or Transfer Project
```bash
git clone <your-repo-url> # or transfer project files
cd comrades-platform
```

## 4. Install Project Dependencies
```bash
# In the backend directory
cd backend
npm install

# In the frontend directory
cd ../frontend
npm install
```

## 5. Configure Environment Variables
Create a `.env` file in the backend directory with your MongoDB URI and other configurations:
```bash
MONGODB_URI=mongodb://localhost:27017/comrades
PORT=5000
JWT_SECRET=your_secret_key
```

## 6. Start the Development Servers
```bash
# Start backend server
cd backend
npm start

# Start frontend server (in a new terminal)
cd ../frontend
npm start
```

## 7. Access the Application
Open your browser and navigate to:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Notes:
- Ensure all required ports (3000 for frontend, 5000 for backend) are open
- If using a remote MongoDB instance, update the MONGODB_URI accordingly
- You might need to install additional dependencies if any Linux-specific packages are required
