import express from "express";
import connectDB from "./config/mongoDBconnect.js";
// Connect to MongoDB
connectDB();
const app = express();
const port = 9090;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}
);