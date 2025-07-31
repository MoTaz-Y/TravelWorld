import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
// import bodyParser from 'body-parser'; //
import morgan from 'morgan'; //
import path from 'path'; //
import { fileURLToPath } from 'url'; //
import { dirname } from 'path'; //
import { connectDB } from './config/db.js'; //
import { errorHandler } from './middleware/errorMiddleware.js'; //
import { notFound } from './middleware/notFoundMiddleware.js'; //

import userRoutes from './routes/userRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import reviewRoutes from './routes/reviewsRoutes.js';
import bookingRoutes from './routes/bookingsRoutes.js';
// import paymentRoutes from './routes/paymentRoutes.js';//

const __filename = fileURLToPath(import.meta.url); //
const __dirname = dirname(__filename); //

config();

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: true,
  credentials: true,
};

// connectDB(); //
mongoose.set('strictQuery', false);
app.use(cors(corsOptions));
app.use(morgan('dev')); //
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); //

app.use('/api/users', userRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookings', bookingRoutes); //
// app.use('/api/payments', paymentRoutes);//

app.use(express.static(path.join(__dirname, '../frontend/build'))); //
app.get('*', (req, res) => {
  //
  res.sendFile(path.join(__dirname, '../frontend/build/index.html')); //
});
app.use(notFound); //
app.use(errorHandler); //

connectDB().then(() => {
  //
  app.listen(PORT, () => {
    //
    console.log(`Server running on port ${PORT}`); //
  });
}); //

// mongoose.connection.once('open', () => {
//   //
//   console.log('Connected to MongoDB'); //
// }); //

// mongoose.connection.on('error', (err) => {
//   //
//   console.log(err); //
// }); //
