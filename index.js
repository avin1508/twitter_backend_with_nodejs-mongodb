import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dbConnection from './config/db.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoute.js';
import tweetRoute from './routes/tweetRoute.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
dbConnection();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Apply CORS middleware
app.use(cors());

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/tweet', tweetRoute);

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
