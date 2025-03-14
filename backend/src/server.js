import express from "express";
import connectDB from "./config/mongoDBconnect.js";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import dotenv from "dotenv";

dotenv.config();
// Connect to MongoDB
connectDB();
 
const app = express();
const port = 9090;

app.use(express.json());
app.use(cors());
 
// Corrected API route
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
