import express from "express";
import connectDB from "./config/mongoDBconnect.js";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import dotenv from "dotenv";
import serviceRouter from "./routes/serviceRoutes.js";

dotenv.config();
// Connect to MongoDB
connectDB();
 
const app = express();
const port = process.env.PORT ||9100;

app.use(express.json()); 
app.use(cors());
   
// Corrected API route
app.use("/api/auth", authRouter);
app.use("/api/services", serviceRouter) ;
 
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
