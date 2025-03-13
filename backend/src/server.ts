import express from "express";
import connectDB from "./config/mongoDBconnect.js";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";

// Connect to MongoDB
connectDB();
const app = express(); 
const port = 9191;

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use(express.json());
app.use(cors()); 
app.use('/api/auth', authRouter);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}
);
